import type { Point2D } from '../types';

function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function computeSilhouetteScore(
  points: Point2D[],
  assignments: number[]
): number | null {
  const uniqueClusters = Array.from(new Set(assignments));
  if (uniqueClusters.length <= 1 || uniqueClusters.length === points.length) {
    return null; 
  }

  const MAX_POINTS = 500;
  let sampledPoints = points;
  let sampledAssignments = assignments;

  if (points.length > MAX_POINTS) {
    const indices = Array.from({ length: points.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const sampledIndices = indices.slice(0, MAX_POINTS);
    sampledPoints = sampledIndices.map(i => points[i]);
    sampledAssignments = sampledIndices.map(i => assignments[i]);
  }

  const clusters = new Map<number, Point2D[]>();
  for (let i = 0; i < sampledPoints.length; i++) {
    const clusterId = sampledAssignments[i];
    if (!clusters.has(clusterId)) {
      clusters.set(clusterId, []);
    }
    clusters.get(clusterId)!.push(sampledPoints[i]);
  }

  let totalSilhouette = 0;
  let validPoints = 0;

  for (let i = 0; i < sampledPoints.length; i++) {
    const point = sampledPoints[i];
    const pointClusterId = sampledAssignments[i];
    const pointCluster = clusters.get(pointClusterId)!;

    if (pointCluster.length <= 1) continue;

    let sumA = 0;
    for (const otherPoint of pointCluster) {
      if (point !== otherPoint) {
        sumA += distance(point, otherPoint);
      }
    }
    const a = sumA / (pointCluster.length - 1);

    let b = Infinity;
    for (const [clusterId, otherClusterPoints] of clusters.entries()) {
      if (clusterId !== pointClusterId && otherClusterPoints.length > 0) {
        let sumB = 0;
        for (const otherPoint of otherClusterPoints) {
          sumB += distance(point, otherPoint);
        }
        const meanB = sumB / otherClusterPoints.length;
        if (meanB < b) b = meanB;
      }
    }

    if (b === Infinity) continue;

    const s = (b - a) / Math.max(a, b);
    totalSilhouette += s;
    validPoints++;
  }

  if (validPoints === 0) return null;
  return totalSilhouette / validPoints;
}

export function computeDaviesBouldinScore(
  points: Point2D[],
  assignments: number[],
  centroids: { x: number; y: number }[]
): number | null {
  const uniqueClusters = Array.from(new Set(assignments));
  if (uniqueClusters.length <= 1) {
    return null;
  }

  const s = new Map<number, number>();
  const clusterCounts = new Map<number, number>();
  const sumDistances = new Map<number, number>();

  for (let i = 0; i < points.length; i++) {
    const clusterId = assignments[i];
    const centroid = centroids[clusterId];
    if (!centroid) continue;

    const dist = distance(points[i], centroid);
    sumDistances.set(clusterId, (sumDistances.get(clusterId) || 0) + dist);
    clusterCounts.set(clusterId, (clusterCounts.get(clusterId) || 0) + 1);
  }

  for (const [clusterId, count] of clusterCounts.entries()) {
    s.set(clusterId, count > 0 ? (sumDistances.get(clusterId) || 0) / count : 0);
  }

  let dbSum = 0;
  let validClusters = 0;

  for (const i of uniqueClusters) {
    if (!centroids[i] || !clusterCounts.has(i)) continue;
    let maxR = -Infinity;
    
    for (const j of uniqueClusters) {
      if (i !== j && centroids[j] && clusterCounts.has(j)) {
        const d = distance(centroids[i], centroids[j]);
        if (d > 0) {
          const r = ((s.get(i) || 0) + (s.get(j) || 0)) / d;
          if (r > maxR) {
            maxR = r;
          }
        }
      }
    }
    
    if (maxR !== -Infinity) {
      dbSum += maxR;
      validClusters++;
    }
  }

  if (validClusters === 0) return null;
  return dbSum / validClusters;
}

export function computeCalinskiHarabaszScore(
  points: Point2D[],
  assignments: number[],
  centroids: { x: number; y: number }[]
): number | null {
  const uniqueClusters = Array.from(new Set(assignments));
  const k = uniqueClusters.length;
  const n = points.length;

  if (k <= 1 || k === n) return null;

  let sumX = 0;
  let sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  const globalMean = { x: sumX / n, y: sumY / n };

  let ssBetween = 0;
  let ssWithin = 0;

  const clusterCounts = new Map<number, number>();
  for (const a of assignments) {
    clusterCounts.set(a, (clusterCounts.get(a) || 0) + 1);
  }

  for (const i of uniqueClusters) {
    const centroid = centroids[i];
    const count = clusterCounts.get(i) || 0;
    if (centroid && count > 0) {
      const dx = centroid.x - globalMean.x;
      const dy = centroid.y - globalMean.y;
      ssBetween += count * (dx * dx + dy * dy);
    }
  }

  for (let i = 0; i < points.length; i++) {
    const clusterId = assignments[i];
    const centroid = centroids[clusterId];
    if (centroid) {
      const dx = points[i].x - centroid.x;
      const dy = points[i].y - centroid.y;
      ssWithin += dx * dx + dy * dy;
    }
  }

  if (ssWithin === 0) return null;

  return (ssBetween / ssWithin) * ((n - k) / (k - 1));
}

export interface ClusterInfo {
  id: number;
  size: number;
  percentage: number;
  centroid: { x: number; y: number } | null;
}

export function computeClusterDistribution(
  points: Point2D[],
  assignments: number[],
  centroids: { x: number; y: number }[]
): ClusterInfo[] {
  const counts = new Map<number, number>();
  for (const a of assignments) {
    counts.set(a, (counts.get(a) || 0) + 1);
  }

  const result: ClusterInfo[] = [];
  const total = points.length;

  for (let i = 0; i < centroids.length; i++) {
    const count = counts.get(i) || 0;
    if (count > 0 || centroids[i]) {
      result.push({
        id: i,
        size: count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        centroid: centroids[i] || null
      });
    }
  }

  return result;
}

export function computeInertia(
  points: Point2D[],
  assignments: number[],
  centroids: { x: number; y: number }[]
): number {
  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    const clusterId = assignments[i];
    const centroid = centroids[clusterId];
    if (centroid) {
      const dx = points[i].x - centroid.x;
      const dy = points[i].y - centroid.y;
      inertia += dx * dx + dy * dy;
    }
  }
  return inertia;
}

export interface ClusterMetrics {
  silhouette: number | null;
  daviesBouldin: number | null;
  calinskiHarabasz: number | null;
  inertia: number;
  clusterDistribution: ClusterInfo[];
  numClusters: number;
  numPoints: number;
  isSampled: boolean;
  sampleSize?: number;
}

export function computeAllClusterMetrics(
  points: Point2D[],
  assignments: number[],
  centroids: { x: number; y: number }[]
): ClusterMetrics {
  const uniqueClusters = new Set(assignments).size;
  const isSampled = points.length > 500;
  
  return {
    silhouette: computeSilhouetteScore(points, assignments),
    daviesBouldin: computeDaviesBouldinScore(points, assignments, centroids),
    calinskiHarabasz: computeCalinskiHarabaszScore(points, assignments, centroids),
    inertia: computeInertia(points, assignments, centroids),
    clusterDistribution: computeClusterDistribution(points, assignments, centroids),
    numClusters: uniqueClusters,
    numPoints: points.length,
    isSampled,
    sampleSize: isSampled ? 500 : undefined
  };
}

export interface ClusterMetricMeta {
  key: string;
  name: string;
  description: string;
  direction: 'higher' | 'lower' | 'context';
  range: string;
}

export const CLUSTER_METRIC_META: ClusterMetricMeta[] = [
  {
    key: 'silhouette',
    name: 'Silhouette Score',
    description: 'Measures how similar an object is to its own cluster compared to other clusters.',
    direction: 'higher',
    range: '[-1, 1]'
  },
  {
    key: 'daviesBouldin',
    name: 'Davies-Bouldin Index',
    description: 'Average similarity measure of each cluster with its most similar cluster. Lower values indicate better clustering.',
    direction: 'lower',
    range: '[0, ∞)'
  },
  {
    key: 'calinskiHarabasz',
    name: 'Calinski-Harabasz Index',
    description: 'Ratio of the sum of between-clusters dispersion and of within-cluster dispersion.',
    direction: 'higher',
    range: '[0, ∞)'
  },
  {
    key: 'inertia',
    name: 'Inertia (WCSS)',
    description: 'Sum of squared distances of samples to their closest cluster center.',
    direction: 'lower',
    range: '[0, ∞)'
  }
];

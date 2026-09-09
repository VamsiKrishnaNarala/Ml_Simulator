export interface Equation {
  label: string;
  latex: string;
  explanation: string;
}

export interface Hyperparameter {
  name: string;
  role: string;
}

export interface AlgoDoc {
  id: string;
  name: string;
  category: 'supervised' | 'unsupervised' | 'semi-supervised' | 'reinforcement';
  subcategory: string;
  problemType: string[];
  simple: string;
  howItWorks: string;
  mathIntuition: string;
  equations: Equation[];
  objective: string;
  optimizer: string;
  advantages: string[];
  disadvantages: string[];
  useCases: string[];
  dataRequirements: string;
  hyperparameters: Hyperparameter[];
  exampleIO: { input: string; output: string };
  metrics: string[];
  complexity?: string;
  playgroundMode?: 'classify' | 'regress' | 'cluster';
  implementationStatus?: 'production' | 'experimental' | 'educational';
}

export const CATEGORIES = ['supervised', 'unsupervised', 'semi-supervised', 'reinforcement'] as const;

export const ALGORITHM_LIBRARY: AlgoDoc[] = [
  // ==========================================
  // SUPERVISED - REGRESSION
  // ==========================================
  {
    id: 'linearRegression',
    name: 'Linear Regression',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Draws the best fitting straight line through the data.',
    howItWorks: 'It calculates the best weights for features to minimize the distance between the predicted line and the actual data points.',
    mathIntuition: 'Assumes a linear relationship between input features and target. Uses OLS or gradient descent.',
    equations: [
      { label: 'Prediction', latex: '\\hat{y} = Xw + b', explanation: 'X: input, w: weights, b: bias, \\hat{y}: prediction' },
      { label: 'MSE Loss', latex: '\\mathcal{L} = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2', explanation: 'n: samples, y: true, \\hat{y}: pred' }
    ],
    objective: 'Minimize Mean Squared Error.',
    optimizer: 'OLS or Gradient Descent',
    advantages: ['Simple to understand', 'Fast to train', 'Interpretable weights'],
    disadvantages: ['Assumes linear relationships', 'Sensitive to outliers', 'Prone to underfitting on complex data'],
    useCases: ['Predicting house prices', 'Sales forecasting', 'Trend analysis'],
    dataRequirements: 'Continuous target, scaled features, no high multicollinearity.',
    hyperparameters: [
      { name: 'fit_intercept', role: 'Whether to calculate intercept' },
      { name: 'normalize', role: 'Whether to normalize inputs' }
    ],
    exampleIO: { input: '[Square Footage: 1500, Bedrooms: 3]', output: 'Price: $300,000' },
    metrics: ['MSE', 'RMSE', 'R2', 'MAE'],
    complexity: 'O(nd^2)',
    playgroundMode: 'regress'
  },
  {
    id: 'polynomialRegression',
    name: 'Polynomial Regression',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Draws a curved line through the data.',
    howItWorks: 'Expands the original features into polynomial combinations to capture non-linear relationships using linear models.',
    mathIntuition: 'Maps input x to polynomial space (x, x^2, x^3) and applies linear regression.',
    equations: [
      { label: 'Prediction', latex: '\\hat{y} = w_0 + w_1x + w_2x^2 + ... + w_dx^d', explanation: 'w: weights, x: input, d: degree' },
      { label: 'Loss', latex: '\\mathcal{L} = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2', explanation: 'Standard MSE' }
    ],
    objective: 'Minimize MSE.',
    optimizer: 'OLS',
    advantages: ['Can model non-linear data', 'Uses linear regression techniques', 'Flexible based on degree'],
    disadvantages: ['Prone to overfitting (high degrees)', 'Extrapolation is poor', 'Sensitive to outliers'],
    useCases: ['Growth rate predictions', 'Population dynamics', 'Complex trend lines'],
    dataRequirements: 'Same as linear regression, but features need polynomial expansion.',
    hyperparameters: [
      { name: 'degree', role: 'The maximum power of features' },
      { name: 'interaction_only', role: 'Produce only interaction features' }
    ],
    exampleIO: { input: '[Time: 5]', output: 'Value: 250' },
    metrics: ['MSE', 'R2'],
    complexity: 'O(n(d^p)^2) where p is degree'
  },
  {
    id: 'ridgeRegression',
    name: 'Ridge Regression',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Linear regression that keeps weights small to avoid overfitting.',
    howItWorks: 'Adds a penalty to the loss function proportional to the square of the weights (L2 regularization).',
    mathIntuition: 'Constrains the magnitude of weights, preventing them from becoming too large when features are correlated.',
    equations: [
      { label: 'Prediction', latex: '\\hat{y} = Xw + b', explanation: 'Standard linear prediction' },
      { label: 'Loss (L2)', latex: '\\mathcal{L} = \\sum(y_i - \\hat{y}_i)^2 + \\alpha\\|w\\|^2_2', explanation: '\\alpha: regularization strength, \\|w\\|_2: L2 norm' }
    ],
    objective: 'Minimize MSE + L2 Penalty.',
    optimizer: 'Gradient Descent / Cholesky',
    advantages: ['Reduces overfitting', 'Handles multicollinearity well', 'Computationally fast'],
    disadvantages: ['Does not perform feature selection', 'Requires hyperparameter tuning for alpha', 'Features must be scaled'],
    useCases: ['Highly correlated features', 'Preventing overfitting in small datasets', 'General forecasting'],
    dataRequirements: 'Scaled features are strictly required.',
    hyperparameters: [
      { name: 'alpha', role: 'Regularization strength' },
      { name: 'solver', role: 'Algorithm to use for optimization' }
    ],
    exampleIO: { input: '[Feature A: 1.2, Feature B: 1.1]', output: 'Value: 5.4' },
    metrics: ['MSE', 'R2']
  },
  {
    id: 'lassoRegression',
    name: 'Lasso Regression',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Linear regression that ignores useless features by setting their weights to zero.',
    howItWorks: 'Adds a penalty proportional to the absolute value of weights (L1 regularization), which forces some weights to exactly zero.',
    mathIntuition: 'The L1 geometry has sharp corners, causing the optimization to frequently hit exact zeros on some axes.',
    equations: [
      { label: 'Prediction', latex: '\\hat{y} = Xw + b', explanation: 'Standard linear prediction' },
      { label: 'Loss (L1)', latex: '\\mathcal{L} = \\frac{1}{2n}\\sum(y_i - \\hat{y}_i)^2 + \\alpha\\|w\\|_1', explanation: '\\alpha: strength, \\|w\\|_1: L1 norm (sum of absolute values)' }
    ],
    objective: 'Minimize MSE + L1 Penalty.',
    optimizer: 'Coordinate Descent',
    advantages: ['Performs automatic feature selection', 'Results in sparse models', 'Reduces overfitting'],
    disadvantages: ['Can arbitrarily drop correlated features', 'Slower than Ridge', 'Fails if n < p (samples < features) sometimes'],
    useCases: ['High dimensional data', 'Gene expression analysis', 'Feature selection'],
    dataRequirements: 'Scaled features required.',
    hyperparameters: [
      { name: 'alpha', role: 'Regularization strength' },
      { name: 'max_iter', role: 'Maximum number of iterations' }
    ],
    exampleIO: { input: '[F1: 1, F2: 0.5, F3: 9]', output: 'Value: 2.1 (F3 was ignored)' },
    metrics: ['MSE', 'R2']
  },
  {
    id: 'elasticNet',
    name: 'Elastic Net',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'The best of both Ridge and Lasso regression.',
    howItWorks: 'Combines L1 and L2 penalties, balancing feature selection with the ability to keep correlated features.',
    mathIntuition: 'Blends L1 (sparsity) and L2 (stability) norms.',
    equations: [
      { label: 'Prediction', latex: '\\hat{y} = Xw + b', explanation: 'Linear prediction' },
      { label: 'Loss', latex: '\\mathcal{L} = \\text{MSE} + r\\alpha\\|w\\|_1 + \\frac{1-r}{2}\\alpha\\|w\\|^2_2', explanation: 'r: l1_ratio, \\alpha: total penalty' }
    ],
    objective: 'Minimize MSE + L1 + L2.',
    optimizer: 'Coordinate Descent',
    advantages: ['Handles correlated features better than Lasso', 'Feature selection capability', 'Very stable'],
    disadvantages: ['Two hyperparameters to tune', 'Computationally more intensive', 'Requires scaling'],
    useCases: ['Bioinformatics', 'Complex financial models', 'Datasets with many correlated features'],
    dataRequirements: 'Scaled features.',
    hyperparameters: [
      { name: 'alpha', role: 'Overall regularization strength' },
      { name: 'l1_ratio', role: 'Mix between L1 and L2 (1 = Lasso)' }
    ],
    exampleIO: { input: '[F1: 2, F2: 2]', output: 'Value: 4.5' },
    metrics: ['MSE', 'R2']
  },
  {
    id: 'svrRegressor',
    name: 'Support Vector Regression',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Fits a tube around the data; errors inside the tube are ignored.',
    howItWorks: 'Uses a margin of tolerance (epsilon) and penalizes points outside this tube, using kernel trick for non-linearity.',
    mathIntuition: 'Finds a function f(x) that has at most epsilon deviation from true targets and is as flat as possible.',
    equations: [
      { label: 'Prediction', latex: 'f(x) = \\sum(\\alpha_i - \\alpha_i^*)K(x_i, x) + b', explanation: '\\alpha: dual coefficients, K: kernel function' },
      { label: 'Objective', latex: '\\min_{w,b,\\xi} \\frac{1}{2}\\|w\\|^2 + C\\sum(\\xi_i + \\xi_i^*)', explanation: 'C: penalty, \\xi: slack variables (errors outside epsilon)' }
    ],
    objective: 'Minimize weights magnitude while keeping errors within epsilon.',
    optimizer: 'SMO (Sequential Minimal Optimization)',
    advantages: ['Robust to outliers', 'Excellent for non-linear data (with kernels)', 'High accuracy on small datasets'],
    disadvantages: ['Poor scaling with large datasets', 'Requires careful tuning of C and gamma', 'Not highly interpretable'],
    useCases: ['Time series prediction', 'Sensor data analysis', 'Any non-linear regression on small data'],
    dataRequirements: 'Needs scaling to be effective.',
    hyperparameters: [
      { name: 'C', role: 'Regularization parameter (lower = more regularization)' },
      { name: 'kernel', role: 'Kernel type (rbf, linear, poly)' }
    ],
    exampleIO: { input: '[X: 5.5]', output: 'Y: 10.2' },
    metrics: ['MSE', 'MAE']
  },
  {
    id: 'decisionTreeRegressor',
    name: 'Decision Tree Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Predicts by asking a series of yes/no questions about the data.',
    howItWorks: 'Splits data repeatedly based on feature thresholds to minimize variance in the resulting leaf nodes.',
    mathIntuition: 'At each node, it searches for a feature and threshold that minimize the MSE of the child nodes.',
    equations: [
      { label: 'Prediction', latex: '\\hat{y} = \\frac{1}{N_{leaf}} \\sum_{i \\in leaf} y_i', explanation: 'Prediction is the mean of true values in the leaf' },
      { label: 'Split Criterion (MSE)', latex: 'H(Q_m) = \\frac{1}{N_m} \\sum_{i \\in Q_m} (y_i - \\bar{y}_m)^2', explanation: 'Variance of targets in node m' }
    ],
    objective: 'Minimize variance/MSE in child nodes.',
    optimizer: 'Greedy splitting (CART)',
    advantages: ['Highly interpretable', 'No need for feature scaling', 'Handles non-linear relationships naturally'],
    disadvantages: ['Extremely prone to overfitting', 'Unstable (small data changes cause huge tree changes)', 'Poor extrapolation'],
    useCases: ['Rule extraction', 'Baseline models', 'Interpretable decision making'],
    dataRequirements: 'Can handle unscaled data and categorical data natively.',
    hyperparameters: [
      { name: 'max_depth', role: 'Maximum depth of the tree' },
      { name: 'min_samples_split', role: 'Minimum samples required to split a node' }
    ],
    exampleIO: { input: '[Age: 30, Income: 50k]', output: 'Prediction: 45' },
    metrics: ['MSE', 'MAE']
  },
  {
    id: 'randomForestRegressor',
    name: 'Random Forest Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'An average of many different decision trees to improve accuracy and prevent overfitting.',
    howItWorks: 'Builds many decision trees on random subsets of data and features (bagging), then averages their predictions.',
    mathIntuition: 'Averaging uncorrelated trees reduces variance without increasing bias.',
    equations: [
      { label: 'Prediction', latex: '\\hat{y} = \\frac{1}{K} \\sum_{k=1}^{K} T_k(x)', explanation: 'K: number of trees, T_k: prediction of tree k' },
      { label: 'Variance Reduction', latex: 'Var(\\hat{y}) \\approx \\rho \\sigma^2 + \\frac{1-\\rho}{K}\\sigma^2', explanation: '\\rho: correlation between trees' }
    ],
    objective: 'Minimize MSE of the ensemble.',
    optimizer: 'CART (Bagged)',
    advantages: ['Very accurate', 'Robust to overfitting', 'Provides feature importance out-of-the-box'],
    disadvantages: ['Slow to train on large datasets', 'Slow to predict compared to linear models', 'Not interpretable (black box)'],
    useCases: ['Tabular data forecasting', 'Kaggle baselines', 'Pricing models'],
    dataRequirements: 'Robust to unscaled data and missing values (sometimes).',
    hyperparameters: [
      { name: 'n_estimators', role: 'Number of trees' },
      { name: 'max_features', role: 'Number of features to consider per split' }
    ],
    exampleIO: { input: '[Features...]', output: 'Y: 23.4' },
    metrics: ['MSE', 'R2']
  },
  {
    id: 'extraTreesRegressor',
    name: 'Extra Trees Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Like Random Forest, but splits data completely randomly.',
    howItWorks: 'Extremely Randomized Trees choose split thresholds randomly rather than finding the optimal one, further reducing variance.',
    mathIntuition: 'Increases bias slightly but reduces variance significantly more than random forests by removing the optimal split search.',
    equations: [
      { label: 'Prediction', latex: '\\hat{y} = \\frac{1}{K} \\sum_{k=1}^{K} T_k(x)', explanation: 'Average of K randomized trees' },
      { label: 'Split Threshold', latex: 't_k \\sim U(min(x_j), max(x_j))', explanation: 'Threshold is drawn uniformly at random' }
    ],
    objective: 'Minimize variance via extreme randomization.',
    optimizer: 'Randomized CART',
    advantages: ['Faster to train than Random Forest', 'Less prone to overfitting', 'Often smoother decision boundaries'],
    disadvantages: ['Higher bias', 'Slightly worse on some datasets than RF', 'Black box model'],
    useCases: ['High-variance datasets', 'Ensemble stacking', 'Fast baseline ensembles'],
    dataRequirements: 'Unscaled tabular data is fine.',
    hyperparameters: [
      { name: 'n_estimators', role: 'Number of trees' },
      { name: 'max_depth', role: 'Max depth of trees' }
    ],
    exampleIO: { input: '[Features...]', output: 'Y: 10' },
    metrics: ['MSE', 'MAE']
  },
  {
    id: 'gradientBoostingRegressor',
    name: 'Gradient Boosting Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Builds trees sequentially, where each new tree corrects the errors of the previous ones.',
    howItWorks: 'Trains a sequence of weak learners (usually small trees) on the residual errors (pseudo-residuals) of the ensemble so far.',
    mathIntuition: 'Optimizes an arbitrary differentiable loss function using gradient descent in the functional space.',
    equations: [
      { label: 'Ensemble Update', latex: 'F_m(x) = F_{m-1}(x) + \\nu h_m(x)', explanation: 'F: ensemble, \\nu: learning rate, h: new tree' },
      { label: 'Residuals', latex: 'r_{im} = -\\left[\\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)}\\right]_{F=F_{m-1}}', explanation: 'Negative gradient of loss' }
    ],
    objective: 'Minimize arbitrary differentiable loss (e.g., MSE, Huber).',
    optimizer: 'Functional Gradient Descent',
    advantages: ['Often the most accurate model for tabular data', 'Handles missing data implicitly', 'Flexible with different loss functions'],
    disadvantages: ['Slow to train (sequential)', 'Prone to overfitting if not tuned properly', 'Harder to tune than Random Forest'],
    useCases: ['Winning Kaggle competitions', 'Click-through rate prediction', 'Complex tabular regression'],
    dataRequirements: 'Tabular data, can handle unscaled features.',
    hyperparameters: [
      { name: 'learning_rate', role: 'Shrinks contribution of each tree' },
      { name: 'n_estimators', role: 'Number of boosting stages' }
    ],
    exampleIO: { input: '[Age: 25]', output: 'Risk Score: 0.12' },
    metrics: ['MSE', 'MAE']
  },
  {
    id: 'adaBoostRegressor',
    name: 'AdaBoost Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Combines multiple weak models, focusing more on data points that are hard to predict.',
    howItWorks: 'Fits a sequence of models, adjusting the sample weights based on the prediction error of the current ensemble.',
    mathIntuition: 'Calculates the weighted error to update weights for instances and determine the weight of the new estimator.',
    equations: [
      { label: 'Prediction', latex: '\\hat{y} = \\sum_{m=1}^{M} \\alpha_m h_m(x)', explanation: '\\alpha: estimator weight, h: estimator' },
      { label: 'Error', latex: '\\epsilon_m = \\sum_{i=1}^n w_i^{(m)} \\left| \\frac{y_i - h_m(x_i)}{\\max|y - h_m|} \\right|', explanation: 'Weighted maximum error' }
    ],
    objective: 'Minimize exponential loss or weighted linear/square loss.',
    optimizer: 'Forward Stagewise Additive Modeling',
    advantages: ['Improves weak learners significantly', 'Less prone to overfitting than GBM in some cases', 'Simple to use'],
    disadvantages: ['Sensitive to noisy data and outliers', 'Slower than single models', 'Usually outperformed by XGBoost/LightGBM'],
    useCases: ['Boosting linear models', 'Improving baseline trees', 'Simple tabular datasets'],
    dataRequirements: 'Sensitive to outliers, cleaning required.',
    hyperparameters: [
      { name: 'n_estimators', role: 'Max number of estimators' },
      { name: 'learning_rate', role: 'Weight applied to each estimator' }
    ],
    exampleIO: { input: '[F1: 0.2]', output: 'Val: 4' },
    metrics: ['MSE']
  },
  {
    id: 'xgboostRegressor',
    name: 'XGBoost Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'An extremely fast and optimized version of gradient boosting.',
    howItWorks: 'Uses second-order gradients, advanced regularization, and hardware optimization to build highly accurate trees.',
    mathIntuition: 'Uses Taylor expansion up to the second order to approximate the loss function and penalizes leaf weights (L1/L2).',
    equations: [
      { label: 'Objective', latex: '\\text{Obj} = \\sum_{i=1}^n L(y_i, \\hat{y}_i) + \\sum_{k=1}^K \\Omega(f_k)', explanation: 'Loss + Regularization' },
      { label: 'Regularization', latex: '\\Omega(f) = \\gamma T + \\frac{1}{2}\\lambda \\sum_{j=1}^T w_j^2', explanation: 'T: leaves, w: leaf weights, \\gamma, \\lambda: penalties' }
    ],
    objective: 'Minimize loss using 2nd order derivatives + structural regularization.',
    optimizer: 'Newton-Raphson Step (Tree building)',
    advantages: ['State-of-the-art performance on tabular data', 'Handles missing values automatically', 'Fast due to parallelization'],
    disadvantages: ['Many hyperparameters to tune', 'Requires more memory than LightGBM', 'Can overfit if depth is not constrained'],
    useCases: ['Financial modeling', 'Kaggle competitions', 'Click prediction'],
    dataRequirements: 'Handles sparse matrices and unscaled data well.',
    hyperparameters: [
      { name: 'eta (learning_rate)', role: 'Step size shrinkage' },
      { name: 'max_depth', role: 'Max depth of tree' }
    ],
    exampleIO: { input: '[F1: 4]', output: 'Prediction: 100' },
    metrics: ['RMSE', 'MAE']
  },
  {
    id: 'lightgbmRegressor',
    name: 'LightGBM Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'A faster gradient boosting model that grows trees leaf-by-leaf instead of level-by-level.',
    howItWorks: 'Uses histogram-based algorithms and Gradient-based One-Side Sampling (GOSS) to speed up training massively.',
    mathIntuition: 'Leaf-wise growth selects the leaf with the max delta loss to grow, resulting in lower loss faster but higher risk of overfitting.',
    equations: [
      { label: 'Histogram Binning', latex: 'O(N \\times \\text{features}) \\rightarrow O(\\text{bins} \\times \\text{features})', explanation: 'Complexity reduction' },
      { label: 'Leaf-wise Split', latex: '\\Delta \\text{Loss} = \\text{Gain}(L) + \\text{Gain}(R) - \\text{Gain}(\\text{Parent})', explanation: 'Maximize loss reduction at a single leaf' }
    ],
    objective: 'Minimize loss via leaf-wise tree growth.',
    optimizer: 'Histogram-based Gradient Descent',
    advantages: ['Extremely fast training', 'Low memory usage', 'High accuracy comparable to XGBoost'],
    disadvantages: ['Can easily overfit on small datasets', 'Leaf-wise growth can create very deep unbalanced trees', 'Hyperparameter tuning required'],
    useCases: ['Large scale datasets (10M+ rows)', 'Real-time learning systems', 'High cardinality data'],
    dataRequirements: 'Excellent for large datasets, handles categoricals well.',
    hyperparameters: [
      { name: 'num_leaves', role: 'Main parameter to control complexity' },
      { name: 'learning_rate', role: 'Impact of each tree' }
    ],
    exampleIO: { input: '[F1: 0]', output: 'Prediction: 10' },
    metrics: ['RMSE', 'MAE']
  },
  {
    id: 'catboostRegressor',
    name: 'CatBoost Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Gradient boosting model designed to handle categorical data automatically without preprocessing.',
    howItWorks: 'Uses ordered boosting and an innovative algorithm to process categorical features during training.',
    mathIntuition: 'Prevents target leakage by using random permutations of the dataset when calculating target statistics for categorical features.',
    equations: [
      { label: 'Target Statistic', latex: '\\hat{x}_i^k = \\frac{\\sum_{j=1}^{i-1}[x_j=x_i^k]Y_j + aP}{\\sum_{j=1}^{i-1}[x_j=x_i^k] + a}', explanation: 'Calculates mean target for category using only preceding rows' },
      { label: 'Ordered Boosting', latex: '\\mathbb{E}(F(x_i)) \\text{ computed using models trained on disjoint subsets}', explanation: 'Avoids prediction shift' }
    ],
    objective: 'Minimize loss using symmetric trees and ordered boosting.',
    optimizer: 'Ordered Boosting',
    advantages: ['Zero preprocessing required for categorical data', 'Highly resistant to overfitting', 'Great out-of-the-box performance'],
    disadvantages: ['Training can be slower than LightGBM', 'Large model size', 'Harder to interpret internal categoricals'],
    useCases: ['Datasets with many string/categorical columns', 'Customer churn', 'Recommendation systems'],
    dataRequirements: 'Feed raw categorical data directly.',
    hyperparameters: [
      { name: 'iterations', role: 'Number of trees' },
      { name: 'depth', role: 'Depth of symmetric trees' }
    ],
    exampleIO: { input: '[City: "Paris"]', output: 'Sales: 5000' },
    metrics: ['RMSE']
  },
  {
    id: 'knnRegressor',
    name: 'KNN Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'Predicts a value by averaging the values of its closest neighbors.',
    howItWorks: 'Finds the K nearest data points in the training set and averages their target values.',
    mathIntuition: 'Uses a distance metric (e.g., Euclidean) to find neighbors, then applies uniform or distance-weighted averaging.',
    equations: [
      { label: 'Distance', latex: 'd(x, x\') = \\sqrt{\\sum_{i=1}^n (x_i - x\'_i)^2}', explanation: 'Euclidean distance' },
      { label: 'Prediction', latex: '\\hat{y} = \\frac{1}{K} \\sum_{x_i \\in N_K(x)} y_i', explanation: 'N_K: Set of K nearest neighbors' }
    ],
    objective: 'Find nearest neighbors and average them.',
    optimizer: 'None (Lazy Learning, kd-tree for search)',
    advantages: ['Simple to understand', 'No training phase', 'Adapts quickly to changes in data'],
    disadvantages: ['Slow at prediction time', 'Curse of dimensionality (fails with many features)', 'Requires keeping all data in memory'],
    useCases: ['Recommender systems baselines', 'Geospatial imputation', 'Small datasets'],
    dataRequirements: 'Features MUST be scaled. Distance metrics fail otherwise.',
    hyperparameters: [
      { name: 'n_neighbors', role: 'Number of neighbors (K)' },
      { name: 'weights', role: 'Uniform or distance-weighted' }
    ],
    exampleIO: { input: '[X: 1, Y: 1]', output: 'Value: 5.5' },
    metrics: ['MSE', 'MAE']
  },
  {
    id: 'mlpRegressor',
    name: 'MLP Regressor',
    category: 'supervised',
    subcategory: 'Regression',
    problemType: ['Regression'],
    simple: 'A basic artificial neural network that predicts continuous values.',
    howItWorks: 'Uses layers of artificial neurons with non-linear activation functions to learn complex mappings from inputs to outputs.',
    mathIntuition: 'Each layer computes a linear transformation followed by a non-linear activation. Backpropagation updates weights using gradients.',
    equations: [
      { label: 'Forward Pass', latex: 'z^{[l]} = W^{[l]}a^{[l-1]} + b^{[l]}, \\quad a^{[l]} = g(z^{[l]})', explanation: 'W: weights, a: activations, g: activation function' },
      { label: 'Weight Update', latex: 'W = W - \\alpha \\frac{\\partial \\mathcal{L}}{\\partial W}', explanation: '\\alpha: learning rate, \\mathcal{L}: MSE loss' }
    ],
    objective: 'Minimize MSE via Backpropagation.',
    optimizer: 'Adam, SGD, or L-BFGS',
    advantages: ['Can learn highly complex non-linear functions', 'Flexible architecture', 'Scales well to large datasets'],
    disadvantages: ['Requires heavy tuning of architecture and hyperparams', 'Prone to overfitting', 'Black box model'],
    useCases: ['Complex pattern recognition', 'Sensor fusion', 'Tabular deep learning'],
    dataRequirements: 'Scaling is absolutely essential for convergence.',
    hyperparameters: [
      { name: 'hidden_layer_sizes', role: 'Tuple defining network structure' },
      { name: 'activation', role: 'Activation function (relu, tanh, etc)' }
    ],
    exampleIO: { input: '[F1, F2...]', output: 'Y: 100' },
    metrics: ['MSE', 'MAE']
  },

  // ==========================================
  // SUPERVISED - CLASSIFICATION
  // ==========================================
  {
    id: 'logisticRegression',
    name: 'Logistic Regression',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Predicts the probability of an item belonging to a class using an S-shaped curve.',
    howItWorks: 'Uses a linear model mapped through a sigmoid function to output probabilities between 0 and 1.',
    mathIntuition: 'Models the log-odds of the probability as a linear combination of features.',
    equations: [
      { label: 'Sigmoid Output', latex: 'P(y=1|x) = \\frac{1}{1+e^{-(Xw + b)}}', explanation: 'Maps linear output to [0,1] probability' },
      { label: 'Log Loss (BCE)', latex: '\\mathcal{L} = -\\frac{1}{N}\\sum [y_i \\log(\\hat{y}_i) + (1-y_i)\\log(1-\\hat{y}_i)]', explanation: 'Cross-entropy loss function' }
    ],
    objective: 'Minimize Binary Cross-Entropy Loss.',
    optimizer: 'L-BFGS / Gradient Descent',
    advantages: ['Output is well-calibrated probabilities', 'Fast and simple', 'Interpretable coefficients'],
    disadvantages: ['Cannot solve non-linear problems easily', 'Assumes linear decision boundary', 'Vulnerable to multicollinearity'],
    useCases: ['Spam detection', 'Credit scoring', 'Medical diagnosis (disease/no disease)'],
    dataRequirements: 'Scaled features and little multicollinearity.',
    hyperparameters: [
      { name: 'C', role: 'Inverse of regularization strength' },
      { name: 'penalty', role: 'L1, L2, or ElasticNet' }
    ],
    exampleIO: { input: '[Income: 50k, Age: 30]', output: 'Class: 1 (Probability: 85%)' },
    metrics: ['Accuracy', 'ROC-AUC', 'F1-Score', 'Precision', 'Recall'],
    playgroundMode: 'classify'
  },
  {
    id: 'knn',
    name: 'KNN Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Classifies an item based on the majority class of its nearest neighbors.',
    howItWorks: 'Finds the K closest data points and assigns the most common class label among them to the new point.',
    mathIntuition: 'Uses distance metrics (Euclidean, Manhattan) in the feature space to define closeness.',
    equations: [
      { label: 'Distance', latex: 'd(x, x\') = \\sqrt{\\sum (x_i - x\'_i)^2}', explanation: 'Distance metric' },
      { label: 'Classification Rule', latex: '\\hat{y} = \\text{argmax}_c \\sum_{x_i \\in N_K(x)} I(y_i = c)', explanation: 'Majority voting among K neighbors' }
    ],
    objective: 'Find neighbors and vote.',
    optimizer: 'Lazy Learning',
    advantages: ['No training required', 'Naturally handles multi-class', 'Non-linear decision boundaries'],
    disadvantages: ['Slow inference time', 'Requires storing all training data', 'Terrible with high dimensional data'],
    useCases: ['Image recognition (basic)', 'Recommendation systems', 'Anomaly detection'],
    dataRequirements: 'Scaling is strictly required.',
    hyperparameters: [
      { name: 'n_neighbors', role: 'Number of neighbors (K)' },
      { name: 'metric', role: 'Distance metric' }
    ],
    exampleIO: { input: '[X: 1.2, Y: 1.5]', output: 'Class: Blue' },
    metrics: ['Accuracy', 'F1-Score'],
    playgroundMode: 'classify'
  },
  {
    id: 'svm',
    name: 'Support Vector Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Finds the widest street (margin) that perfectly separates different classes.',
    howItWorks: 'Constructs a hyperplane that maximizes the margin between classes. Uses kernels to separate non-linear data.',
    mathIntuition: 'Optimizes a margin boundary defined by a few support vectors. Kernel trick maps data to higher dimensions.',
    equations: [
      { label: 'Hyperplane', latex: 'w \\cdot x + b = 0', explanation: 'Decision boundary' },
      { label: 'Objective', latex: '\\min_{w,b} \\frac{1}{2}\\|w\\|^2 + C\\sum \\xi_i', explanation: 'Maximize margin (minimize ||w||) while penalizing errors (\\xi)' }
    ],
    objective: 'Maximize margin between classes.',
    optimizer: 'SMO Algorithm',
    advantages: ['Effective in high dimensional spaces', 'Memory efficient (uses only support vectors)', 'Versatile via kernel functions'],
    disadvantages: ['Slow on large datasets (>100k rows)', 'Hard to tune C and Gamma', 'Does not provide direct probabilities'],
    useCases: ['Text classification', 'Image recognition', 'Bioinformatics (Cancer classification)'],
    dataRequirements: 'Scaling is required.',
    hyperparameters: [
      { name: 'C', role: 'Regularization (Penalty for misclassification)' },
      { name: 'kernel', role: 'Linear, RBF, Poly, etc.' }
    ],
    exampleIO: { input: '[X: 2.1, Y: 0.1]', output: 'Class: 1' },
    metrics: ['Accuracy', 'Precision', 'Recall'],
    playgroundMode: 'classify'
  },
  {
    id: 'decisionTree',
    name: 'Decision Tree Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Makes decisions by answering a sequence of yes/no questions.',
    howItWorks: 'Splits the dataset on feature thresholds to maximize the purity of the resulting leaf nodes.',
    mathIntuition: 'Uses Information Gain (Entropy) or Gini Impurity to decide the best split at each node.',
    equations: [
      { label: 'Gini Impurity', latex: 'G = 1 - \\sum_{i=1}^C p_i^2', explanation: 'p_i: probability of class i in the node' },
      { label: 'Information Gain', latex: 'IG = E(parent) - \\sum \\frac{N_j}{N} E(child_j)', explanation: 'Reduction in entropy after split' }
    ],
    objective: 'Maximize Information Gain / Minimize Gini.',
    optimizer: 'CART (Greedy)',
    advantages: ['Easy to interpret and visualize', 'No scaling required', 'Handles non-linear patterns'],
    disadvantages: ['Highly prone to overfitting', 'Unstable to small data changes', 'Biased towards features with many levels'],
    useCases: ['Medical decision rules', 'Credit approval', 'Customer segmentation'],
    dataRequirements: 'Handles raw data well.',
    hyperparameters: [
      { name: 'max_depth', role: 'Limit tree depth' },
      { name: 'criterion', role: 'Gini or Entropy' }
    ],
    exampleIO: { input: '[Age: 25, Income: High]', output: 'Class: Approved' },
    metrics: ['Accuracy', 'ROC-AUC'],
    playgroundMode: 'classify'
  },
  {
    id: 'randomForest',
    name: 'Random Forest Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'A committee of decision trees voting on the final classification.',
    howItWorks: 'Builds many trees using bootstrap sampling of data and random subsets of features, then takes majority vote.',
    mathIntuition: 'Decorrelates trees via random feature selection, reducing overall variance without increasing bias.',
    equations: [
      { label: 'Majority Vote', latex: '\\hat{y} = \\text{mode}\\{T_1(x), T_2(x), ..., T_K(x)\\}', explanation: 'Final prediction is the most frequent class' },
      { label: 'OOB Error', latex: 'Err_{OOB} = \\frac{1}{n} \\sum I(y_i \\neq \\text{mode}\\{T_k(x_i) | x_i \\notin \\text{Bootstrap}_k\\})', explanation: 'Out-of-bag error estimate' }
    ],
    objective: 'Minimize Gini/Entropy per tree, maximize ensemble accuracy.',
    optimizer: 'Bagged CART',
    advantages: ['Highly accurate', 'Resistant to overfitting', 'Provides feature importance'],
    disadvantages: ['Large memory footprint', 'Slower inference than single tree', 'Not interpretable'],
    useCases: ['Fraud detection', 'Disease prediction', 'Image classification'],
    dataRequirements: 'Handles missing values and unscaled data well.',
    hyperparameters: [
      { name: 'n_estimators', role: 'Number of trees' },
      { name: 'max_features', role: 'Features per split (usually sqrt(n_features))' }
    ],
    exampleIO: { input: '[Features...]', output: 'Class: 0' },
    metrics: ['Accuracy', 'F1-Score', 'ROC-AUC'],
    playgroundMode: 'classify'
  },
  {
    id: 'extraTreesClassifier',
    name: 'Extra Trees Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'An even more randomized version of Random Forest.',
    howItWorks: 'Instead of finding the best split threshold like Random Forest, it picks random thresholds for features and selects the best among those.',
    mathIntuition: 'Trades a slight increase in bias for a significant reduction in variance compared to Random Forest.',
    equations: [
      { label: 'Random Threshold', latex: 't_j \\sim U(\\min(x_j), \\max(x_j))', explanation: 'Thresholds are uniform random' },
      { label: 'Ensemble Vote', latex: '\\hat{y} = \\text{mode}\\{T_k(x)\\}', explanation: 'Majority vote' }
    ],
    objective: 'Minimize Gini/Entropy via extremely randomized splits.',
    optimizer: 'Randomized CART',
    advantages: ['Faster training than RF', 'Sometimes yields smoother decision boundaries', 'Less prone to overfitting'],
    disadvantages: ['Can have higher bias', 'Black box', 'Still uses a lot of memory'],
    useCases: ['High dimensional classification', 'Feature selection', 'Ensemble stacking'],
    dataRequirements: 'Unscaled data is fine.',
    hyperparameters: [
      { name: 'n_estimators', role: 'Number of trees' },
      { name: 'criterion', role: 'Gini or entropy' }
    ],
    exampleIO: { input: '[Features]', output: 'Class: 1' },
    metrics: ['Accuracy', 'F1-Score']
  },
  {
    id: 'adaBoostClassifier',
    name: 'AdaBoost Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Trains weak models sequentially, forcing new models to focus on the mistakes of the previous ones.',
    howItWorks: 'Uses decision stumps. Increases the weight of misclassified samples so the next stump tries harder to classify them correctly.',
    mathIntuition: 'Minimizes the exponential loss function using forward stagewise additive modeling.',
    equations: [
      { label: 'Estimator Weight', latex: '\\alpha_m = \\frac{1}{2} \\ln\\left(\\frac{1-\\epsilon_m}{\\epsilon_m}\\right)', explanation: '\\epsilon: weighted error of stump m' },
      { label: 'Weight Update', latex: 'w_i^{(m+1)} = w_i^{(m)} \\exp(-\\alpha_m y_i h_m(x_i))', explanation: 'Increase weight if misclassified (y_i \\neq h_m(x_i))' }
    ],
    objective: 'Minimize Exponential Loss.',
    optimizer: 'Stagewise Additive Modeling',
    advantages: ['Theoretically immune to overfitting (in low noise)', 'Simple to implement', 'Highly effective with stumps'],
    disadvantages: ['Extremely sensitive to noisy data and outliers', 'Slow sequential training', 'Can overfit if noise is present'],
    useCases: ['Face detection (Viola-Jones)', 'Customer churn', 'Binary classification'],
    dataRequirements: 'Clean data, highly sensitive to outliers.',
    hyperparameters: [
      { name: 'n_estimators', role: 'Number of boosting stages' },
      { name: 'learning_rate', role: 'Shrinkage parameter' }
    ],
    exampleIO: { input: '[F1: 2]', output: 'Class: 0' },
    metrics: ['Accuracy', 'ROC-AUC']
  },
  {
    id: 'gradientBoostingClassifier',
    name: 'Gradient Boosting Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Builds trees sequentially to correct the residual errors of the previous trees using gradients.',
    howItWorks: 'Instead of tweaking sample weights, it trains the new tree directly on the negative gradient (pseudo-residuals) of the loss function.',
    mathIntuition: 'Performs gradient descent in the space of functions, specifically targeting log-loss for classification.',
    equations: [
      { label: 'Log Odds Update', latex: 'F_m(x) = F_{m-1}(x) + \\gamma_m h_m(x)', explanation: 'Updates log-odds predictions' },
      { label: 'Probability', latex: 'P(y=1|x) = \\frac{1}{1 + e^{-F_M(x)}}', explanation: 'Sigmoid conversion of final ensemble' }
    ],
    objective: 'Minimize Log Loss (Deviance).',
    optimizer: 'Functional Gradient Descent',
    advantages: ['High predictive accuracy', 'Handles mixed data types well', 'Robust loss functions available'],
    disadvantages: ['Requires careful tuning', 'Slow to train', 'Can overfit if depth/estimators are too high'],
    useCases: ['Tabular data classification', 'Search ranking', 'Risk modeling'],
    dataRequirements: 'Handles unscaled data well.',
    hyperparameters: [
      { name: 'learning_rate', role: 'Contribution of each tree' },
      { name: 'max_depth', role: 'Depth of trees (usually small, 3-5)' }
    ],
    exampleIO: { input: '[Features]', output: 'Class: 1' },
    metrics: ['ROC-AUC', 'Log Loss', 'Accuracy']
  },
  {
    id: 'xgboostClassifier',
    name: 'XGBoost Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Extreme Gradient Boosting - the king of Kaggle for tabular data.',
    howItWorks: 'An optimized distributed gradient boosting library designed to be highly efficient, flexible and portable.',
    mathIntuition: 'Uses Newton-Raphson (2nd order derivatives) to calculate tree leaves and applies L1/L2 regularization to trees.',
    equations: [
      { label: 'Leaf Weight', latex: 'w_j^* = -\\frac{\\sum_{i \\in I_j} g_i}{\\sum_{i \\in I_j} h_i + \\lambda}', explanation: 'g, h: 1st and 2nd derivatives of loss, \\lambda: L2 penalty' },
      { label: 'Gain', latex: '\\text{Gain} = \\frac{1}{2} \\left[ \\frac{G_L^2}{H_L+\\lambda} + \\frac{G_R^2}{H_R+\\lambda} - \\frac{G^2}{H+\\lambda} \\right] - \\gamma', explanation: 'Score for splitting a node' }
    ],
    objective: 'Minimize Log Loss + Structural Complexity.',
    optimizer: 'Newton-Raphson Tree Building',
    advantages: ['Extremely accurate', 'Built-in cross-validation and regularizations', 'Parallelized tree building'],
    disadvantages: ['Lots of hyperparameters', 'Consumes significant memory', 'Can overfit if not regularized'],
    useCases: ['Click-through rate', 'Fraud detection', 'Any competitive tabular problem'],
    dataRequirements: 'Handles sparse data and missing values.',
    hyperparameters: [
      { name: 'max_depth', role: 'Tree depth' },
      { name: 'min_child_weight', role: 'Minimum sum of instance weight (hessian) needed in a child' }
    ],
    exampleIO: { input: '[Data]', output: 'Prob: 0.92 -> Class: 1' },
    metrics: ['ROC-AUC', 'Log Loss', 'F1']
  },
  {
    id: 'lightgbmClassifier',
    name: 'LightGBM Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'A Microsoft-developed gradient boosting model that is insanely fast and memory-efficient.',
    howItWorks: 'Uses histogram-based split finding and grows trees leaf-wise (best-first) rather than depth-wise.',
    mathIntuition: 'Leaf-wise tree growth minimizes the loss more efficiently but requires constraints to prevent extreme depth.',
    equations: [
      { label: 'Histogram Update', latex: 'H(parent) = H(child_1) + H(child_2)', explanation: 'Histograms can be subtracted for O(1) child calculation' },
      { label: 'GOSS', latex: '\\text{Sampling weights} \\propto |\\text{gradients}|', explanation: 'Keeps large gradients, samples small ones' }
    ],
    objective: 'Minimize Log Loss via Leaf-wise growth.',
    optimizer: 'Histogram + GOSS',
    advantages: ['Fastest training speed', 'Lowest memory usage', 'Great for >10k rows'],
    disadvantages: ['Prone to overfitting on datasets <10k rows', 'Requires tuning `num_leaves` heavily', 'Leaf-wise can be unstable'],
    useCases: ['Real-time ad bidding', 'Massive scale classifications', 'High cardinality categorical data'],
    dataRequirements: 'Needs a decent amount of data to prevent overfitting.',
    hyperparameters: [
      { name: 'num_leaves', role: 'Max leaves per tree' },
      { name: 'learning_rate', role: 'Step size' }
    ],
    exampleIO: { input: '[Data]', output: 'Class: 0' },
    metrics: ['ROC-AUC', 'Log Loss']
  },
  {
    id: 'catboostClassifier',
    name: 'CatBoost Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'A gradient boosting algorithm by Yandex that rules categorical features without manual encoding.',
    howItWorks: 'Uses symmetric (oblivious) trees and ordered boosting to prevent target leakage when encoding categoricals.',
    mathIntuition: 'Target statistics for categorical encoding are computed purely based on "historical" random permutations of rows.',
    equations: [
      { label: 'Target Encoding', latex: '\\text{encode}(x_i) = \\frac{\\text{count}(Y=1) + \\text{prior}}{\\text{count}(\\text{all}) + 1}', explanation: 'Computed on a random prefix of data' },
      { label: 'Symmetric Split', latex: '\\text{All nodes at depth } d \\text{ use same feature/threshold}', explanation: 'Extremely fast inference' }
    ],
    objective: 'Minimize Log Loss using symmetric trees.',
    optimizer: 'Ordered Boosting',
    advantages: ['No need for One-Hot or Target Encoding', 'Rarely overfits (very robust defaults)', 'Lightning fast inference'],
    disadvantages: ['Slower training time than LightGBM', 'Heavy memory footprint during training', 'Complex internal mechanics'],
    useCases: ['E-commerce recommendations', 'Search ranking', 'Data with many categorical strings'],
    dataRequirements: 'Pass raw categorical strings directly.',
    hyperparameters: [
      { name: 'iterations', role: 'Number of trees' },
      { name: 'learning_rate', role: 'Step size' }
    ],
    exampleIO: { input: '[Color: "Red", Size: "XL"]', output: 'Class: 1' },
    metrics: ['ROC-AUC', 'Accuracy']
  },
  {
    id: 'gaussianNaiveBayes',
    name: 'Gaussian Naive Bayes',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Uses probability to classify data, assuming features follow a bell curve and are independent.',
    howItWorks: 'Applies Bayes theorem assuming all features are conditionally independent and follow a Gaussian (normal) distribution.',
    mathIntuition: 'Calculates the probability of each class given the features and picks the highest. Assumes Gaussian likelihood.',
    equations: [
      { label: 'Bayes Theorem', latex: 'P(y|X) = \\frac{P(X|y)P(y)}{P(X)}', explanation: 'Posterior probability' },
      { label: 'Gaussian Likelihood', latex: 'P(x_i|y) = \\frac{1}{\\sqrt{2\\pi\\sigma_y^2}} \\exp\\left(-\\frac{(x_i - \\mu_y)^2}{2\\sigma_y^2}\\right)', explanation: 'Probability density function of normal distribution' }
    ],
    objective: 'Maximize Posterior Probability (MAP).',
    optimizer: 'Closed Form (Mean/Variance calculation)',
    advantages: ['Extremely fast', 'Works well with high dimensions', 'Needs very little training data'],
    disadvantages: ['"Naive" independence assumption is rarely true', 'Bad at estimating exact probabilities', 'Assumes Gaussian distribution'],
    useCases: ['Spam filtering', 'Document classification', 'Fast baseline models'],
    dataRequirements: 'Features should ideally be continuous and normally distributed.',
    hyperparameters: [
      { name: 'var_smoothing', role: 'Portion of largest variance added to variances for calculation stability' },
      { name: 'priors', role: 'Prior probabilities of the classes' }
    ],
    exampleIO: { input: '[F1: 0.5]', output: 'Class: Spam' },
    metrics: ['Accuracy', 'F1'],
    playgroundMode: 'classify'
  },
  {
    id: 'multinomialNaiveBayes',
    name: 'Multinomial Naive Bayes',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Naive Bayes designed specifically for counting things, like word frequencies in text.',
    howItWorks: 'Similar to Gaussian NB, but models the data using a multinomial distribution instead of Gaussian.',
    mathIntuition: 'Calculates probability based on discrete counts (e.g., how many times word X appears in document Y).',
    equations: [
      { label: 'Likelihood', latex: 'P(X|y) \\propto \\prod_{i=1}^n p_{yi}^{x_i}', explanation: 'p_{yi}: probability of feature i in class y, x_i: count' },
      { label: 'Parameter Est (Laplace)', latex: '\\hat{p}_{yi} = \\frac{N_{yi} + \\alpha}{N_y + \\alpha n}', explanation: '\\alpha: smoothing parameter to handle zero counts' }
    ],
    objective: 'Maximize Posterior Probability.',
    optimizer: 'Closed Form (Frequency counts)',
    advantages: ['Standard for text classification', 'Fast training and inference', 'Handles zero counts elegantly with Laplace smoothing'],
    disadvantages: ['Assumes features (words) are independent', 'Ignores word order (Bag of Words)', 'Cannot handle negative values'],
    useCases: ['Sentiment analysis', 'Topic categorization', 'Text spam detection'],
    dataRequirements: 'Requires discrete counts (integers) or TF-IDF fractions.',
    hyperparameters: [
      { name: 'alpha', role: 'Laplace/Lidstone smoothing parameter' },
      { name: 'fit_prior', role: 'Whether to learn class prior probabilities' }
    ],
    exampleIO: { input: '["Free money now"]', output: 'Class: Spam' },
    metrics: ['Accuracy', 'F1']
  },
  {
    id: 'bernoulliNaiveBayes',
    name: 'Bernoulli Naive Bayes',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'Naive Bayes for binary (true/false) features.',
    howItWorks: 'Assumes features are binary booleans (e.g., word is present vs word is absent) and uses a Bernoulli distribution.',
    mathIntuition: 'Penalizes the non-occurrence of a feature, unlike Multinomial NB which just ignores it.',
    equations: [
      { label: 'Likelihood', latex: 'P(x_i|y) = p_{yi}^{x_i} (1-p_{yi})^{(1-x_i)}', explanation: 'x_i is 1 or 0, p_{yi} is probability of feature i in class y' },
      { label: 'Log Posterior', latex: '\\log P(y|X) \\propto \\log P(y) + \\sum [x_i \\log p_{yi} + (1-x_i)\\log(1-p_{yi})]', explanation: 'Linear decision boundary' }
    ],
    objective: 'Maximize Posterior Probability.',
    optimizer: 'Closed Form (Binary frequencies)',
    advantages: ['Excellent for short texts', 'Extremely fast', 'Effectively penalizes missing features'],
    disadvantages: ['Requires binary data', 'Naive assumption of independence', 'Worse than Multinomial for long documents'],
    useCases: ['Short text classification', 'Binary survey data', 'Spam detection (presence of bad words)'],
    dataRequirements: 'Features MUST be binary (0 or 1).',
    hyperparameters: [
      { name: 'alpha', role: 'Smoothing parameter' },
      { name: 'binarize', role: 'Threshold for binarizing continuous features' }
    ],
    exampleIO: { input: '[Contains "Viagra": 1, Contains "Meeting": 0]', output: 'Class: Spam' },
    metrics: ['Accuracy']
  },
  {
    id: 'mlpClassifier',
    name: 'MLP Classifier',
    category: 'supervised',
    subcategory: 'Classification',
    problemType: ['Classification'],
    simple: 'A standard neural network for classifying data.',
    howItWorks: 'Passes data through hidden layers of neurons. Uses a Softmax or Sigmoid output layer to generate class probabilities.',
    mathIntuition: 'Learns non-linear representations using gradient descent and backpropagation to minimize Cross-Entropy loss.',
    equations: [
      { label: 'Softmax Output', latex: '\\hat{y}_c = \\frac{e^{z_c}}{\\sum_j e^{z_j}}', explanation: 'Converts final layer raw scores to probabilities summing to 1' },
      { label: 'Cross Entropy Loss', latex: '\\mathcal{L} = -\\sum_{c=1}^M y_c \\log(\\hat{y}_c)', explanation: 'Measures divergence between predicted and true distributions' }
    ],
    objective: 'Minimize Cross-Entropy Loss via Backprop.',
    optimizer: 'Adam, SGD, etc.',
    advantages: ['Can approximate any continuous function', 'Highly adaptable', 'Strong performance on complex data'],
    disadvantages: ['Computationally heavy', 'Requires lots of data to prevent overfitting', 'No interpretability'],
    useCases: ['Image classification', 'Speech recognition', 'Complex tabular data'],
    dataRequirements: 'Scaling is absolutely critical.',
    hyperparameters: [
      { name: 'hidden_layer_sizes', role: 'Neurons per layer' },
      { name: 'alpha', role: 'L2 penalty parameter' }
    ],
    exampleIO: { input: '[Features]', output: 'Class probabilities' },
    metrics: ['Accuracy', 'Log Loss', 'ROC-AUC']
  },

  // ==========================================
  // UNSUPERVISED - CLUSTERING
  // ==========================================
  {
    id: 'kmeans',
    name: 'K-Means',
    category: 'unsupervised',
    subcategory: 'Clustering',
    problemType: ['Clustering'],
    simple: 'Groups data into K distinct clusters based on distance to cluster centers.',
    howItWorks: 'Places K random centroids, assigns points to the nearest centroid, moves centroid to the mean of points, and repeats until convergence.',
    mathIntuition: 'Minimizes the within-cluster sum of squares (inertia).',
    equations: [
      { label: 'Objective (Inertia)', latex: 'J = \\sum_{j=1}^K \\sum_{x_i \\in C_j} \\|x_i - \\mu_j\\|^2', explanation: 'Minimize variance within clusters' },
      { label: 'Centroid Update', latex: '\\mu_j = \\frac{1}{|C_j|} \\sum_{x_i \\in C_j} x_i', explanation: 'Mean of assigned points' }
    ],
    objective: 'Minimize Inertia (Within-Cluster Sum of Squares).',
    optimizer: 'Lloyd\'s Algorithm (Expectation-Maximization)',
    advantages: ['Very fast', 'Scales well to large datasets', 'Easy to understand'],
    disadvantages: ['Must specify K in advance', 'Assumes clusters are spherical', 'Sensitive to initializations and outliers'],
    useCases: ['Customer segmentation', 'Image quantization', 'Document clustering'],
    dataRequirements: 'Features must be scaled. Distance metric is sensitive.',
    hyperparameters: [
      { name: 'n_clusters', role: 'Number of centroids (K)' },
      { name: 'init', role: 'Initialization method (e.g., k-means++)' }
    ],
    exampleIO: { input: '[X, Y coordinates]', output: 'Cluster ID: 2' },
    metrics: ['Silhouette Score', 'Inertia'],
    playgroundMode: 'cluster'
  },
  {
    id: 'minibatchKmeans',
    name: 'MiniBatch K-Means',
    category: 'unsupervised',
    subcategory: 'Clustering',
    problemType: ['Clustering'],
    simple: 'A faster version of K-Means that looks at small random chunks of data at a time.',
    howItWorks: 'Uses mini-batches of data to update cluster centroids, drastically reducing computation time at the cost of a tiny bit of accuracy.',
    mathIntuition: 'Stochastic approximation of Lloyd\'s algorithm. Updates centroids using a running average.',
    equations: [
      { label: 'Learning Rate Update', latex: '\\mu_c \\leftarrow \\mu_c (1-\\eta) + x_i \\eta', explanation: '\\eta: learning rate based on counts, updates centroid' },
      { label: 'Objective', latex: 'J \\approx \\sum_{batch} \\|x_i - \\mu_{c(x_i)}\\|^2', explanation: 'Approximated Inertia' }
    ],
    objective: 'Minimize Inertia (Approximated).',
    optimizer: 'Stochastic Gradient-like Updates',
    advantages: ['Massively faster on huge datasets', 'Low memory usage', 'Results are almost identical to standard K-Means'],
    disadvantages: ['Slightly lower quality clusters', 'Still suffers from K-Means assumptions (spheres, k-specified)'],
    useCases: ['Massive dataset clustering', 'Real-time clustering streams', 'Web-scale customer segmentation'],
    dataRequirements: 'Scaled numerical data.',
    hyperparameters: [
      { name: 'n_clusters', role: 'Number of clusters (K)' },
      { name: 'batch_size', role: 'Size of the mini-batches' }
    ],
    exampleIO: { input: '[Data]', output: 'Cluster ID' },
    metrics: ['Silhouette', 'Inertia']
  },
  {
    id: 'hierarchicalClustering',
    name: 'Hierarchical Agglomerative Clustering',
    category: 'unsupervised',
    subcategory: 'Clustering',
    problemType: ['Clustering'],
    simple: 'Builds a tree of clusters by repeatedly merging the closest two clusters together.',
    howItWorks: 'Starts with every point as its own cluster, then merges the two closest clusters, repeating until only one giant cluster remains.',
    mathIntuition: 'Uses a linkage criteria (e.g., Ward, Complete, Single) to define the distance between sets of points.',
    equations: [
      { label: 'Ward Linkage', latex: 'd(u,v) = \\sqrt{\\frac{|u||v|}{|u|+|v|}} \\|\\mu_u - \\mu_v\\|_2', explanation: 'Minimizes variance merging u and v' },
      { label: 'Single Linkage', latex: 'd(u,v) = \\min_{x \\in u, y \\in v} d(x,y)', explanation: 'Distance between closest points' }
    ],
    objective: 'Create a dendrogram based on linkage criteria.',
    optimizer: 'Agglomerative (Bottom-Up)',
    advantages: ['Outputs a hierarchy (dendrogram)', 'Does not require specifying K in advance', 'Can handle non-spherical shapes (Single linkage)'],
    disadvantages: ['Extremely slow (O(N^3) time)', 'High memory requirement (O(N^2))', 'Once a merge is done, it cannot be undone'],
    useCases: ['Taxonomy creation (Biology)', 'Gene expression analysis', 'Hierarchical grouping'],
    dataRequirements: 'Scales poorly, keep data < 10,000 samples.',
    hyperparameters: [
      { name: 'n_clusters', role: 'Where to cut the tree' },
      { name: 'linkage', role: 'Ward, complete, average, or single' }
    ],
    exampleIO: { input: '[Data]', output: 'Cluster ID (at specific cut)' },
    metrics: ['Silhouette', 'Cophenetic Correlation']
  },
  {
    id: 'dbscan',
    name: 'DBSCAN',
    category: 'unsupervised',
    subcategory: 'Clustering',
    problemType: ['Clustering'],
    simple: 'Finds clusters based on dense areas of points, marking isolated points as noise.',
    howItWorks: 'Groups points that are packed closely together (many neighbors within radius epsilon), marking low-density regions as outliers.',
    mathIntuition: 'Defines Core Points, Reachable Points, and Outliers based on distance epsilon (\\epsilon) and minimum points (MinPts).',
    equations: [
      { label: 'Neighborhood', latex: 'N_\\epsilon(p) = \\{q \\in D | d(p,q) \\leq \\epsilon\\}', explanation: 'Points within epsilon radius' },
      { label: 'Core Point Condition', latex: '|N_\\epsilon(p)| \\geq \\text{MinPts}', explanation: 'Condition for p to be a core point' }
    ],
    objective: 'Identify connected components of dense regions.',
    optimizer: 'Density-based expansion',
    advantages: ['Does not require specifying K', 'Can find arbitrarily shaped clusters', 'Robust to outliers (identifies them as noise)'],
    disadvantages: ['Fails if clusters have varying densities', 'Sensitive to epsilon parameter', 'Struggles with high dimensionality'],
    useCases: ['Geospatial analysis', 'Anomaly detection', 'Non-linear shape clustering'],
    dataRequirements: 'Scaling is critical to set a meaningful epsilon.',
    hyperparameters: [
      { name: 'eps', role: 'Radius of neighborhood' },
      { name: 'min_samples', role: 'Points needed to form a dense region' }
    ],
    exampleIO: { input: '[X, Y]', output: 'Cluster ID (or -1 for noise)' },
    metrics: ['Silhouette']
  },
  {
    id: 'hdbscan',
    name: 'HDBSCAN',
    category: 'unsupervised',
    subcategory: 'Clustering',
    problemType: ['Clustering'],
    simple: 'A smarter DBSCAN that can find clusters of different densities.',
    howItWorks: 'Converts DBSCAN into a hierarchical clustering algorithm, then extracts a flat clustering based on cluster stability.',
    mathIntuition: 'Uses Mutual Reachability Distance to push noise away, then builds a Minimum Spanning Tree to find persistent clusters.',
    equations: [
      { label: 'Core Distance', latex: 'core_k(x) = \\text{distance to } k\\text{-th nearest neighbor}', explanation: 'Density estimate' },
      { label: 'Mutual Reachability', latex: 'd_{mreach-k}(a,b) = \\max\\{core_k(a), core_k(b), d(a,b)\\}', explanation: 'Distance metric pushing apart sparse points' }
    ],
    objective: 'Maximize cluster stability over varying density thresholds.',
    optimizer: 'Minimum Spanning Tree / Condensation',
    advantages: ['Finds clusters of varying densities', 'Requires minimal hyperparameter tuning', 'Robust outlier detection'],
    disadvantages: ['Slower than K-Means', 'Complex under the hood', 'Can sometimes leave too many points as noise'],
    useCases: ['Topic modeling (used in BERTopic)', 'Complex spatial data', 'Unsupervised outlier detection'],
    dataRequirements: 'Handles varied density well.',
    hyperparameters: [
      { name: 'min_cluster_size', role: 'Minimum size to consider a group a cluster' },
      { name: 'min_samples', role: 'Controls how conservative the clustering is' }
    ],
    exampleIO: { input: '[Data]', output: 'Cluster ID or -1' },
    metrics: ['DBCV (Density-Based Clustering Validation)']
  },
  {
    id: 'gaussianMixture',
    name: 'Gaussian Mixture Model',
    category: 'unsupervised',
    subcategory: 'Clustering',
    problemType: ['Clustering'],
    simple: 'Assumes data is generated by a mix of several overlapping Gaussian distributions (bell curves).',
    howItWorks: 'Finds the parameters (mean, variance) of K Gaussian distributions that best fit the data. Points are assigned probabilities of belonging to each cluster.',
    mathIntuition: 'Uses Expectation-Maximization (EM) to maximize the likelihood of the data given the Gaussian parameters.',
    equations: [
      { label: 'Mixture Model', latex: 'P(x) = \\sum_{k=1}^K \\pi_k \\mathcal{N}(x | \\mu_k, \\Sigma_k)', explanation: '\\pi: mixture weights, \\mathcal{N}: multivariate normal' },
      { label: 'EM - E-step', latex: '\\gamma(z_{nk}) = \\frac{\\pi_k \\mathcal{N}(x_n | \\mu_k, \\Sigma_k)}{\\sum_j \\pi_j \\mathcal{N}(x_n | \\mu_j, \\Sigma_j)}', explanation: 'Responsibility of cluster k for point n' }
    ],
    objective: 'Maximize Log-Likelihood via EM Algorithm.',
    optimizer: 'Expectation-Maximization',
    advantages: ['Soft clustering (gives probabilities)', 'Can form elliptical clusters (unlike K-Means)', 'Mathematically rigorous'],
    disadvantages: ['Must specify K', 'Can converge to local optima', 'Struggles in high dimensions (covariance matrix becomes huge)'],
    useCases: ['Anomaly detection (low probability = anomaly)', 'Speech recognition', 'Generative modeling'],
    dataRequirements: 'Data should roughly follow continuous distributions.',
    hyperparameters: [
      { name: 'n_components', role: 'Number of Gaussian distributions' },
      { name: 'covariance_type', role: 'Shape of clusters (spherical, diag, full)' }
    ],
    exampleIO: { input: '[Data]', output: 'Probabilities for each cluster' },
    metrics: ['BIC', 'AIC']
  },
  {
    id: 'meanShift',
    name: 'Mean Shift',
    category: 'unsupervised',
    subcategory: 'Clustering',
    problemType: ['Clustering'],
    simple: 'Finds clusters by making points slide up the "density hill" to the highest peak.',
    howItWorks: 'Places a window around every point and calculates the center of mass. Shifts the window to the center of mass, repeating until convergence at peaks (modes).',
    mathIntuition: 'A non-parametric kernel density estimation technique. It finds local maxima of the density function.',
    equations: [
      { label: 'Kernel Density', latex: 'f(x) = \\frac{1}{nh^d} \\sum_{i=1}^n K\\left(\\frac{x-x_i}{h}\\right)', explanation: 'K: kernel (usually Gaussian), h: bandwidth' },
      { label: 'Mean Shift Vector', latex: 'm(x) = \\frac{\\sum x_i K(x_i - x)}{\\sum K(x_i - x)} - x', explanation: 'Vector pointing to the local increase in density' }
    ],
    objective: 'Find local maxima (modes) of density.',
    optimizer: 'Gradient Ascent on Density',
    advantages: ['Does not require specifying K', 'Can handle complex shapes', 'Only requires bandwidth parameter'],
    disadvantages: ['Very computationally expensive (O(N^2))', 'Not suitable for large datasets', 'Performance depends heavily on bandwidth'],
    useCases: ['Image segmentation', 'Computer vision tracking (CamShift)', 'Spatial analysis'],
    dataRequirements: 'Works well in low dimensional spatial data.',
    hyperparameters: [
      { name: 'bandwidth', role: 'Radius of the window (determines cluster size)' },
      { name: 'bin_seeding', role: 'Speeds up algorithm by discretizing initial locations' }
    ],
    exampleIO: { input: '[Data]', output: 'Cluster ID' },
    metrics: ['Silhouette']
  },
  {
    id: 'spectralClustering',
    name: 'Spectral Clustering',
    category: 'unsupervised',
    subcategory: 'Clustering',
    problemType: ['Clustering'],
    simple: 'Uses the connections (graph) between points to find clusters, solving complex shapes like concentric circles.',
    howItWorks: 'Creates a graph of connections, calculates the Graph Laplacian, finds its eigenvalues, and applies K-Means to the transformed space.',
    mathIntuition: 'Maps data to a lower-dimensional space using eigenvectors of the similarity matrix, where standard clustering (K-Means) works better.',
    equations: [
      { label: 'Laplacian', latex: 'L = D - W', explanation: 'D: Degree matrix, W: Adjacency (similarity) matrix' },
      { label: 'Eigenvalue Problem', latex: 'L v = \\lambda D v', explanation: 'Solve for eigenvectors v for dimensionality reduction' }
    ],
    objective: 'Minimize normalized graph cuts.',
    optimizer: 'Eigendecomposition + K-Means',
    advantages: ['Can find clusters of any arbitrary shape', 'Outperforms K-Means on complex manifolds', 'Elegant graph-theoretic foundation'],
    disadvantages: ['Very slow for large N (eigendecomposition is O(N^3))', 'Requires specifying K', 'Sensitive to similarity graph construction'],
    useCases: ['Image segmentation (Normalized Cuts)', 'Social network community detection', 'Non-convex shapes'],
    dataRequirements: 'Similarity metric heavily influences outcome.',
    hyperparameters: [
      { name: 'n_clusters', role: 'Number of clusters' },
      { name: 'affinity', role: 'How to construct graph (nearest_neighbors or rbf)' }
    ],
    exampleIO: { input: '[Data]', output: 'Cluster ID' },
    metrics: ['Silhouette']
  },
  {
    id: 'birch',
    name: 'BIRCH',
    category: 'unsupervised',
    subcategory: 'Clustering',
    problemType: ['Clustering'],
    simple: 'Builds a tree summarizing the data as it streams in, clustering the summaries rather than the raw data.',
    howItWorks: 'Constructs a Clustering Feature (CF) Tree sequentially. It compresses data into small CF subclusters, which are then clustered globally.',
    mathIntuition: 'Maintains CF = (N, Linear Sum, Squared Sum) allowing calculation of centroid and radius without keeping raw points in memory.',
    equations: [
      { label: 'Clustering Feature', latex: 'CF = (N, \\vec{LS}, SS)', explanation: 'N: count, LS: linear sum, SS: square sum' },
      { label: 'Centroid', latex: '\\vec{x}_0 = \\frac{\\vec{LS}}{N}', explanation: 'Calculated from CF vector directly' }
    ],
    objective: 'Build an in-memory CF tree to minimize I/O costs.',
    optimizer: 'Hierarchical Tree Construction',
    advantages: ['Extremely memory efficient (O(1) memory)', 'One pass over data', 'Great for massive datasets'],
    disadvantages: ['Only works well for spherical clusters', 'Final clustering still requires another algorithm (like Agglomerative)', 'Sensitive to data ordering'],
    useCases: ['Out-of-core learning (too big for RAM)', 'Streaming data clustering', 'Massive database clustering'],
    dataRequirements: 'Numeric continuous data only.',
    hyperparameters: [
      { name: 'threshold', role: 'Radius limit for subclusters in tree' },
      { name: 'branching_factor', role: 'Maximum children per node in CF tree' }
    ],
    exampleIO: { input: '[Data stream]', output: 'Cluster ID' },
    metrics: ['Silhouette']
  },

  // ==========================================
  // UNSUPERVISED - DIMENSIONALITY REDUCTION
  // ==========================================
  {
    id: 'pca',
    name: 'PCA',
    category: 'unsupervised',
    subcategory: 'Dimensionality Reduction',
    problemType: ['Dimensionality Reduction'],
    simple: 'Squashes data into fewer dimensions by finding the lines of maximum variance.',
    howItWorks: 'Finds new orthogonal axes (Principal Components) that explain the most variance in the data, discarding axes with little variance.',
    mathIntuition: 'Calculates the eigenvectors of the data\'s covariance matrix. Sorts them by eigenvalues to find most important axes.',
    equations: [
      { label: 'Covariance Matrix', latex: 'C = \\frac{1}{n-1} X^T X', explanation: 'Assuming X is mean-centered' },
      { label: 'Eigendecomposition', latex: 'C v = \\lambda v', explanation: 'v: Principal component, \\lambda: variance explained' }
    ],
    objective: 'Maximize variance of projected data / Minimize reconstruction error.',
    optimizer: 'SVD (Singular Value Decomposition)',
    advantages: ['Removes correlated features', 'Reduces noise', 'Fast and highly interpretable'],
    disadvantages: ['Assumes linear relationships', 'Results in uninterpretable features', 'Sensitive to outliers'],
    useCases: ['Data visualization (2D/3D)', 'Preprocessing for ML models', 'Noise filtering'],
    dataRequirements: 'Features MUST be standardized (mean 0, variance 1).',
    hyperparameters: [
      { name: 'n_components', role: 'Number of dimensions to keep' },
      { name: 'svd_solver', role: 'Algorithm to use for SVD' }
    ],
    exampleIO: { input: '[100D Vector]', output: '[2D Vector]' },
    metrics: ['Explained Variance Ratio']
  },
  {
    id: 'kernelPca',
    name: 'Kernel PCA',
    category: 'unsupervised',
    subcategory: 'Dimensionality Reduction',
    problemType: ['Dimensionality Reduction'],
    simple: 'PCA that can "unroll" complex non-linear shapes like a Swiss roll.',
    howItWorks: 'Uses the kernel trick to implicitly map data into a higher-dimensional space where it becomes linearly separable, then applies PCA.',
    mathIntuition: 'Computes eigenvectors of the Kernel matrix instead of the Covariance matrix.',
    equations: [
      { label: 'Kernel Matrix', latex: 'K_{ij} = \\kappa(x_i, x_j)', explanation: '\\kappa: kernel function (e.g., RBF)' },
      { label: 'Eigenproblem', latex: 'K \\alpha = \\lambda \\alpha', explanation: '\\alpha: eigenvectors in kernel space' }
    ],
    objective: 'Maximize variance in a high-dimensional kernel space.',
    optimizer: 'Eigendecomposition of Kernel Matrix',
    advantages: ['Can unfold non-linear manifolds', 'Powerful for complex image data', 'Maintains PCA mathematics'],
    disadvantages: ['Very slow for large datasets (O(N^3))', 'Requires tuning kernel hyperparameters', 'No inverse transform (hard to reconstruct data)'],
    useCases: ['Non-linear feature extraction', 'Complex manifold unrolling', 'Advanced visualization'],
    dataRequirements: 'Needs scaling.',
    hyperparameters: [
      { name: 'n_components', role: 'Target dimensions' },
      { name: 'kernel', role: 'rbf, poly, sigmoid, cosine' }
    ],
    exampleIO: { input: '[Non-linear 3D data]', output: '[Flat 2D data]' },
    metrics: ['Explained Variance (Approximate)']
  },
  {
    id: 'incrementalPca',
    name: 'Incremental PCA',
    category: 'unsupervised',
    subcategory: 'Dimensionality Reduction',
    problemType: ['Dimensionality Reduction'],
    simple: 'PCA that processes data in chunks, so you don\'t run out of RAM.',
    howItWorks: 'Approximates PCA by processing data in mini-batches, updating the singular values and components iteratively.',
    mathIntuition: 'Uses a variation of SVD (Singular Value Decomposition) that updates the decomposition with new block matrices.',
    equations: [
      { label: 'Batch Covariance Update', latex: 'C_{new} = \\frac{N_{old}C_{old} + N_{batch}C_{batch}}{N_{old} + N_{batch}} + \\Delta', explanation: 'Iterative update of covariance' },
      { label: 'Projection', latex: 'X_{reduced} = X_{batch} V', explanation: 'Projection using current components' }
    ],
    objective: 'Approximate PCA sequentially.',
    optimizer: 'Incremental SVD',
    advantages: ['Constant memory usage O(batch_size)', 'Can run on datasets larger than RAM', 'Results almost identical to standard PCA'],
    disadvantages: ['Slightly slower than full PCA if data fits in RAM', 'Small approximation errors', 'Batch size must be >= n_components'],
    useCases: ['Out-of-core learning', 'Streaming data', 'Massive image datasets'],
    dataRequirements: 'Standardization should be done iteratively or prior.',
    hyperparameters: [
      { name: 'n_components', role: 'Target dimensions' },
      { name: 'batch_size', role: 'Number of samples per chunk' }
    ],
    exampleIO: { input: '[1M x 1000 Matrix, chunked]', output: '[1M x 10 Matrix]' },
    metrics: ['Explained Variance Ratio']
  },
  {
    id: 'ica',
    name: 'Independent Component Analysis (ICA)',
    category: 'unsupervised',
    subcategory: 'Dimensionality Reduction',
    problemType: ['Dimensionality Reduction'],
    simple: 'Separates a mixed signal into its original independent sources (like unmixing overlapping voices).',
    howItWorks: 'Assumes data is a linear mixture of non-Gaussian independent sources. It rotates the data to maximize the non-Gaussianity of the components.',
    mathIntuition: 'By the Central Limit Theorem, mixtures are more Gaussian than their sources. ICA maximizes statistical independence (e.g., maximizing kurtosis).',
    equations: [
      { label: 'Mixing Model', latex: 'X = A S', explanation: 'X: observed, A: mixing matrix, S: independent sources' },
      { label: 'Unmixing', latex: 'S = W X', explanation: 'Find W (inverse of A) to recover S' }
    ],
    objective: 'Maximize statistical independence (non-Gaussianity) of components.',
    optimizer: 'FastICA Algorithm',
    advantages: ['Can blindly separate mixed signals', 'Finds truly independent features (not just uncorrelated like PCA)', 'Excellent for time series/audio'],
    disadvantages: ['Cannot separate Gaussian sources', 'Order of components is arbitrary', 'Scaling of components is arbitrary'],
    useCases: ['Cocktail party problem (audio separation)', 'EEG/fMRI artifact removal', 'Financial time series unmixing'],
    dataRequirements: 'Sources must be non-Gaussian and independent.',
    hyperparameters: [
      { name: 'n_components', role: 'Number of sources' },
      { name: 'algorithm', role: 'parallel or deflation' }
    ],
    exampleIO: { input: '[Mixed Audio Tracks]', output: '[Isolated Vocals, Isolated Drums]' },
    metrics: ['Kurtosis', 'Negentropy']
  },
  {
    id: 'tsne',
    name: 't-SNE',
    category: 'unsupervised',
    subcategory: 'Dimensionality Reduction',
    problemType: ['Dimensionality Reduction'],
    simple: 'The best tool for visualizing high-dimensional data in 2D or 3D.',
    howItWorks: 'Calculates similarities between points in high dimensions using a Gaussian distribution, then creates a low-dimensional map using a t-distribution that matches those similarities.',
    mathIntuition: 'Minimizes the Kullback-Leibler (KL) divergence between the joint probability distributions of the high-dimensional and low-dimensional data.',
    equations: [
      { label: 'High-D Similarity', latex: 'p_{j|i} = \\frac{\\exp(-\\|x_i - x_j\\|^2 / 2\\sigma_i^2)}{\\sum_{k \\neq i} \\exp(-\\|x_i - x_k\\|^2 / 2\\sigma_i^2)}', explanation: 'Probability based on Gaussian' },
      { label: 'Low-D Similarity', latex: 'q_{ij} = \\frac{(1 + \\|y_i - y_j\\|^2)^{-1}}{\\sum_{k \\neq l} (1 + \\|y_k - y_l\\|^2)^{-1}}', explanation: 'Probability based on Student-t (heavy tails)' }
    ],
    objective: 'Minimize KL Divergence between P and Q.',
    optimizer: 'Gradient Descent (Barnes-Hut approximation)',
    advantages: ['Produces incredibly beautiful and clear 2D/3D visualizations', 'Reveals local and global structures', 'Handles non-linear relationships perfectly'],
    disadvantages: ['Extremely slow on large datasets', 'Cannot be used to transform new/unseen data', 'Distance between clusters in 2D means nothing'],
    useCases: ['Visualizing word embeddings', 'Genomics visualization', 'Understanding deep learning representations'],
    dataRequirements: 'Usually recommended to run PCA first to reduce to ~50 dims.',
    hyperparameters: [
      { name: 'perplexity', role: 'Balances attention between local and global aspects' },
      { name: 'learning_rate', role: 'Gradient descent step size' }
    ],
    exampleIO: { input: '[784D MNIST Image]', output: '[2D Coordinates for Plotting]' },
    metrics: ['KL Divergence']
  },
  {
    id: 'umap',
    name: 'UMAP',
    category: 'unsupervised',
    subcategory: 'Dimensionality Reduction',
    problemType: ['Dimensionality Reduction'],
    simple: 'A faster, better t-SNE that preserves the global shape of the data.',
    howItWorks: 'Uses Riemannian geometry and algebraic topology to build a fuzzy topological structure of the data, then optimizes a low-dimensional graph to match it.',
    mathIntuition: 'Optimizes Cross-Entropy between high-dimensional fuzzy simplicial sets and low-dimensional equivalents.',
    equations: [
      { label: 'Fuzzy Set Union', latex: 'p_{ij} = p_{i|j} + p_{j|i} - p_{i|j}p_{j|i}', explanation: 'Symmetrization of probabilities' },
      { label: 'Cross Entropy', latex: 'C = \\sum [p_{ij} \\log(\\frac{p_{ij}}{q_{ij}}) + (1-p_{ij}) \\log(\\frac{1-p_{ij}}{1-q_{ij}})]', explanation: 'Optimization objective' }
    ],
    objective: 'Minimize Cross-Entropy between topological graphs.',
    optimizer: 'Stochastic Gradient Descent',
    advantages: ['Much faster than t-SNE', 'Preserves global structure (distances between clusters matter)', 'Can transform new unseen data'],
    disadvantages: ['Math is extremely complex', 'Still requires tuning parameters for good plots', 'Can sometimes over-cluster noise'],
    useCases: ['Single-cell RNA sequencing', 'Image embedding visualization', 'General dimensionality reduction pipeline'],
    dataRequirements: 'Scales well, handles various metrics.',
    hyperparameters: [
      { name: 'n_neighbors', role: 'Controls local vs global structure preservation' },
      { name: 'min_dist', role: 'Controls how tightly points are packed together' }
    ],
    exampleIO: { input: '[High-D Data]', output: '[2D Map]' },
    metrics: ['Cross Entropy Loss']
  },

  // ==========================================
  // UNSUPERVISED - ASSOCIATION RULES
  // ==========================================
  {
    id: 'apriori',
    name: 'Apriori',
    category: 'unsupervised',
    subcategory: 'Association Rules',
    problemType: ['Pattern Mining'],
    simple: 'Finds items that frequently occur together (e.g., "People who buy diapers also buy beer").',
    howItWorks: 'Uses a breadth-first search to find frequent itemsets. It relies on the principle that any subset of a frequent itemset must also be frequent.',
    mathIntuition: 'Prunes the search space using the anti-monotone property of support.',
    equations: [
      { label: 'Support', latex: 'Supp(X) = \\frac{\\text{Transactions containing } X}{\\text{Total Transactions}}', explanation: 'Frequency of itemset' },
      { label: 'Confidence', latex: 'Conf(X \\rightarrow Y) = \\frac{Supp(X \\cup Y)}{Supp(X)}', explanation: 'Conditional probability of Y given X' }
    ],
    objective: 'Find rules exceeding minimum Support and Confidence.',
    optimizer: 'Candidate Generation & Pruning',
    advantages: ['Easy to implement', 'Produces highly interpretable rules', 'Exhaustive search guarantees finding rules'],
    disadvantages: ['Generates massive amounts of candidates (slow)', 'Requires multiple database scans', 'Terrible for large dense datasets'],
    useCases: ['Market basket analysis', 'Recommendation engines', 'Web log mining'],
    dataRequirements: 'Categorical/Transactional data only (Lists of items).',
    hyperparameters: [
      { name: 'min_support', role: 'Minimum frequency to be considered' },
      { name: 'min_confidence', role: 'Minimum reliability of a rule' }
    ],
    exampleIO: { input: '[[Bread, Milk], [Bread, Milk, Beer]]', output: 'Rule: Bread -> Milk (Confidence: 100%)' },
    metrics: ['Support', 'Confidence', 'Lift']
  },
  {
    id: 'fpGrowth',
    name: 'FP-Growth',
    category: 'unsupervised',
    subcategory: 'Association Rules',
    problemType: ['Pattern Mining'],
    simple: 'A much faster version of Apriori that builds a tree instead of generating candidate lists.',
    howItWorks: 'Compresses the database into a Frequent Pattern (FP) Tree, retaining item association info. Then recursively mines this tree.',
    mathIntuition: 'Avoids explicit candidate generation by utilizing a divide-and-conquer strategy on a compact prefix-tree structure.',
    equations: [
      { label: 'Lift', latex: 'Lift(X \\rightarrow Y) = \\frac{Supp(X \\cup Y)}{Supp(X) \\times Supp(Y)}', explanation: 'Measures independence. Lift > 1 means positive correlation.' },
      { label: 'Tree Node', latex: 'Node = (item\\_name, count, node\\_link)', explanation: 'Structure of the FP-Tree' }
    ],
    objective: 'Mine frequent itemsets without candidate generation.',
    optimizer: 'FP-Tree traversal',
    advantages: ['Orders of magnitude faster than Apriori', 'Only requires 2 database scans', 'Memory efficient due to compression'],
    disadvantages: ['FP-Tree might not fit in memory for massive, sparse datasets', 'Complex to implement from scratch', 'Resulting rules are identical to Apriori'],
    useCases: ['Large scale market basket analysis', 'Bioinformatics motif finding', 'Inventory management'],
    dataRequirements: 'Transactional data.',
    hyperparameters: [
      { name: 'min_support', role: 'Minimum threshold for tree nodes' },
      { name: 'min_confidence', role: 'Threshold for rule generation' }
    ],
    exampleIO: { input: '[[A,B], [B,C], [A,B,C]]', output: 'Frequent Pattern: [A,B]' },
    metrics: ['Support', 'Confidence', 'Lift']
  },
  {
    id: 'eclat',
    name: 'Eclat',
    category: 'unsupervised',
    subcategory: 'Association Rules',
    problemType: ['Pattern Mining'],
    simple: 'Finds frequent itemsets by intersecting lists of transaction IDs.',
    howItWorks: 'Instead of horizontal data (Transactions -> Items), it uses vertical data (Items -> Transactions). It finds subsets by intersecting the transaction IDs of items.',
    mathIntuition: 'Support is calculated by the length of the intersection of two Tid-lists (Transaction ID lists).',
    equations: [
      { label: 'Vertical Intersection', latex: 'TidList(X \\cup Y) = TidList(X) \\cap TidList(Y)', explanation: 'Transactions containing both X and Y' },
      { label: 'Support via Intersect', latex: 'Supp(X \\cup Y) = |TidList(X \\cup Y)|', explanation: 'Cardinality of the intersection set' }
    ],
    objective: 'Mine frequent itemsets using Depth-First Search on Tid-lists.',
    optimizer: 'Tid-list Intersection',
    advantages: ['Very fast for specific types of data', 'Depth-first search requires less memory than Apriori', 'Simple set intersection logic'],
    disadvantages: ['Tid-lists can get too large for memory', 'Performance degrades if itemsets are very long', 'Usually doesn\'t calculate Confidence natively'],
    useCases: ['Text mining (word co-occurrence)', 'Dense datasets', 'Fast itemset discovery'],
    dataRequirements: 'Data must be inverted to Vertical Format.',
    hyperparameters: [
      { name: 'min_support', role: 'Minimum transaction count threshold' },
      { name: 'max_len', role: 'Maximum length of itemset' }
    ],
    exampleIO: { input: 'Item A: [T1, T2], Item B: [T2, T3]', output: 'A & B: [T2] (Support = 1)' },
    metrics: ['Support']
  },

  // ==========================================
  // SEMI-SUPERVISED
  // ==========================================
  {
    id: 'selfTraining',
    name: 'Self-Training',
    category: 'semi-supervised',
    subcategory: 'Wrapper Methods',
    problemType: ['Classification'],
    simple: 'A model trains on labeled data, predicts labels for unlabeled data, and uses its most confident predictions to train itself again.',
    howItWorks: 'Iteratively expands the training set by treating the model\'s high-confidence predictions on unlabeled data (pseudo-labels) as truth.',
    mathIntuition: 'Assumes the model\'s high-confidence boundaries are correct, effectively pushing decision boundaries into low-density regions.',
    equations: [
      { label: 'Pseudo-Labeling', latex: '\\hat{y}_u = \\text{argmax}_c P(y=c | x_u, \\theta)', explanation: 'Predict label for unlabeled point' },
      { label: 'Confidence Threshold', latex: 'P(y=\\hat{y}_u | x_u) \\geq \\tau', explanation: '\\tau: threshold to accept pseudo-label into training set' }
    ],
    objective: 'Minimize loss on labeled data + confident unlabeled data.',
    optimizer: 'Iterative re-training',
    advantages: ['Can wrap around ANY base classifier', 'Very simple to implement', 'Scales well'],
    disadvantages: ['Confirmation bias (early mistakes get amplified)', 'Requires well-calibrated probabilities', 'Fails if initial model is bad'],
    useCases: ['Natural Language Processing', 'Web page categorization', 'When you have 99% unlabeled data'],
    dataRequirements: 'Needs a small, high-quality set of initial labels.',
    hyperparameters: [
      { name: 'threshold', role: 'Confidence required to accept a pseudo-label' },
      { name: 'base_estimator', role: 'The underlying ML model to use' }
    ],
    exampleIO: { input: '[10 Labeled, 1000 Unlabeled]', output: '[Model trained on 1010 points]' },
    metrics: ['Accuracy on holdout set'],
    implementationStatus: 'educational'
  },
  {
    id: 'labelPropagation',
    name: 'Label Propagation',
    category: 'semi-supervised',
    subcategory: 'Graph-Based',
    problemType: ['Classification'],
    simple: 'Labels spread through a graph of connected data points like a virus.',
    howItWorks: 'Constructs a similarity graph of all points. Known labels push their values to connected unlabeled neighbors iteratively until convergence.',
    mathIntuition: 'Functions as a random walk on a graph. The probability of a label depends on the transition matrix derived from point similarities.',
    equations: [
      { label: 'Transition Matrix', latex: 'T_{ij} = \\frac{w_{ij}}{\\sum_k w_{kj}}', explanation: 'w: edge weight (similarity) between i and j' },
      { label: 'Propagation Step', latex: 'Y^{(t+1)} = T Y^{(t)}', explanation: 'Update probabilities based on neighbors (labeled points are reset to true labels)' }
    ],
    objective: 'Reach steady state of label distributions on the graph.',
    optimizer: 'Matrix Multiplication / Iteration',
    advantages: ['Mathematically elegant', 'Fast convergence', 'Captures complex manifold structures'],
    disadvantages: ['Hard labeling means bad initial labels ruin everything', 'Requires constructing an O(N^2) graph', 'Does not generalize to unseen data out-of-the-box'],
    useCases: ['Community detection in networks', 'Image segmentation', 'Transductive learning'],
    dataRequirements: 'Meaningful distance metric to build the graph.',
    hyperparameters: [
      { name: 'kernel', role: 'rbf or knn for graph building' },
      { name: 'gamma', role: 'Parameter for rbf kernel' }
    ],
    exampleIO: { input: '[Graph with 2 colored nodes]', output: '[Fully colored graph]' },
    metrics: ['Accuracy on unlabeled set'],
    implementationStatus: 'educational'
  },
  {
    id: 'labelSpreading',
    name: 'Label Spreading',
    category: 'semi-supervised',
    subcategory: 'Graph-Based',
    problemType: ['Classification'],
    simple: 'A more robust version of Label Propagation that allows initial labels to change if they seem wrong.',
    howItWorks: 'Similar to Propagation, but uses the Normalized Graph Laplacian and allows a "soft clamping" of initial labels to handle noise.',
    mathIntuition: 'Minimizes a cost function that balances local smoothness (neighbors should have same label) with global consistency (respect initial labels).',
    equations: [
      { label: 'Normalized Laplacian', latex: 'S = D^{-1/2} W D^{-1/2}', explanation: 'Symmetric normalized similarity matrix' },
      { label: 'Update Rule', latex: 'Y^{(t+1)} = \\alpha S Y^{(t)} + (1-\\alpha) Y^{(0)}', explanation: '\\alpha: clamping factor. Balances network info with prior info.' }
    ],
    objective: 'Minimize graph regularization loss.',
    optimizer: 'Iterative Spectral Updates',
    advantages: ['Robust to noise in initial labels', 'Smooth probability distributions', 'Better mathematical convergence properties'],
    disadvantages: ['Computationally heavy for large N', 'Requires tuning alpha parameter'],
    useCases: ['Noisy sensor networks', 'Text classification with bad initial labels'],
    dataRequirements: 'Scaled data for RBF graph construction.',
    hyperparameters: [
      { name: 'alpha', role: 'Clamping factor (how much to trust initial labels)' },
      { name: 'kernel', role: 'rbf or knn' }
    ],
    exampleIO: { input: '[Noisy Labels]', output: '[Smoothed Labels]' },
    metrics: ['Accuracy'],
    implementationStatus: 'educational'
  },
  {
    id: 'semiSupervisedSvm',
    name: 'Semi-Supervised SVM (S3VM)',
    category: 'semi-supervised',
    subcategory: 'Low-Density Separation',
    problemType: ['Classification'],
    simple: 'Finds an SVM boundary that not only separates the labeled data but also passes through empty spaces in the unlabeled data.',
    howItWorks: 'Extends SVM by forcing the decision boundary to pass through regions of low data density, keeping unlabeled points far from the margin.',
    mathIntuition: 'Adds a penalty term for unlabeled points that fall inside the SVM margin, effectively treating them as missing variables in the optimization.',
    equations: [
      { label: 'Objective', latex: '\\min_{w,b,y_u} \\frac{1}{2}\\|w\\|^2 + C_L \\sum_{i \\in L} L(y_i, f(x_i)) + C_U \\sum_{j \\in U} L(y_j^*, f(x_j))', explanation: 'L is hinge loss. y_j^* are guessed labels.' },
      { label: 'Margin Constraint', latex: 'y_i(w \\cdot x_i + b) \\geq 1 - \\xi_i', explanation: 'Standard SVM constraint' }
    ],
    objective: 'Maximize margin for labeled data while minimizing density crossing for unlabeled.',
    optimizer: 'Branch and Bound / Heuristic Search',
    advantages: ['Theoretically sound low-density separation', 'Can yield massive improvements over standard SVM'],
    disadvantages: ['Non-convex optimization (very hard to solve)', 'Prone to local minima', 'Does not scale well'],
    useCases: ['Text classification', 'Bioinformatics where labels are expensive'],
    dataRequirements: 'Standard SVM scaling rules apply.',
    hyperparameters: [
      { name: 'C_L', role: 'Penalty for labeled errors' },
      { name: 'C_U', role: 'Penalty for unlabeled points in margin' }
    ],
    exampleIO: { input: '[2 Labeled, 100 Unlabeled]', output: '[Boundary in sparse region]' },
    metrics: ['Accuracy'],
    implementationStatus: 'educational'
  },
  {
    id: 'pseudoLabeling',
    name: 'Pseudo Labeling',
    category: 'semi-supervised',
    subcategory: 'Deep Learning',
    problemType: ['Classification'],
    simple: 'Trains a neural network simultaneously on labeled data and its own confident predictions on unlabeled data.',
    howItWorks: 'Passes a batch of labeled and unlabeled data through a network. The network\'s max predicted probability is used as a hard target for the unlabeled data loss.',
    mathIntuition: 'Acts as Entropy Minimization. By forcing the network to predict a hard label for unlabeled data, it pushes the network to make highly confident predictions.',
    equations: [
      { label: 'Loss Function', latex: 'L = \\frac{1}{N_L}\\sum_{i=1}^{N_L} L_{CE}(y_i, f(x_i)) + \\alpha(t) \\frac{1}{N_U}\\sum_{j=1}^{N_U} L_{CE}(\\hat{y}_j, f(x_j))', explanation: '\\alpha(t) increases over time' },
      { label: 'Pseudo-Label', latex: '\\hat{y}_j = \\text{argmax}_c f_c(x_j)', explanation: 'Hard label assignment' }
    ],
    objective: 'Minimize standard loss + weighted unsupervised loss.',
    optimizer: 'SGD / Adam',
    advantages: ['Extremely easy to add to any PyTorch/TF model', 'Improves feature representations', 'Works well with data augmentation'],
    disadvantages: ['Can suffer from confirmation bias', 'Requires tuning the alpha schedule'],
    useCases: ['Deep Learning semi-supervised tasks', 'Kaggle image competitions'],
    dataRequirements: 'Requires neural network infrastructure.',
    hyperparameters: [
      { name: 'alpha_schedule', role: 'How fast to increase weight of unlabeled loss' },
      { name: 'threshold', role: 'Confidence threshold' }
    ],
    exampleIO: { input: '[Images]', output: '[Improved Network Weights]' },
    metrics: ['Accuracy'],
    implementationStatus: 'educational'
  },
  {
    id: 'coTraining',
    name: 'Co-Training',
    category: 'semi-supervised',
    subcategory: 'Multi-View',
    problemType: ['Classification'],
    simple: 'Two different models look at two different aspects of the data and teach each other.',
    howItWorks: 'Requires data to have two distinct "views" (e.g., text of a webpage vs. links pointing to it). Model A trains on View 1, Model B on View 2. They then label data for each other.',
    mathIntuition: 'If the views are conditionally independent given the class, models can provide uncorrelated pseudo-labels, avoiding confirmation bias.',
    equations: [
      { label: 'View Split', latex: 'X = X^{(1)} \\times X^{(2)}', explanation: 'Features split into two conditionally independent sets' },
      { label: 'Mutual Update', latex: 'L_{new} = L \\cup \\{ (x_u, \\hat{y}_A) \\} \\cup \\{ (x_u, \\hat{y}_B) \\}', explanation: 'Each model adds confident predictions to training set' }
    ],
    objective: 'Iteratively train two classifiers on disjoint feature sets.',
    optimizer: 'Iterative Wrapper',
    advantages: ['Avoids confirmation bias of Self-Training', 'Highly effective when strong independent views exist'],
    disadvantages: ['Requires data that can be naturally split into two views', 'Fails if views are highly correlated'],
    useCases: ['Webpage classification (Text vs Links)', 'Video analysis (Audio vs Visual)'],
    dataRequirements: 'MUST have two conditionally independent feature sets.',
    hyperparameters: [
      { name: 'base_estimator_1', role: 'Model for View 1' },
      { name: 'base_estimator_2', role: 'Model for View 2' }
    ],
    exampleIO: { input: '[Page Text, Page Links]', output: '[Classified Page]' },
    metrics: ['Accuracy'],
    implementationStatus: 'educational'
  },
  {
    id: 'consistencyRegularization',
    name: 'Consistency Regularization',
    category: 'semi-supervised',
    subcategory: 'Deep Learning',
    problemType: ['Classification'],
    simple: 'Forces a neural network to give the exact same output even if the input image is slightly altered.',
    howItWorks: 'Takes an unlabeled image, creates two slightly different versions (e.g., cropped, rotated), and penalizes the network if its predictions for the two versions differ.',
    mathIntuition: 'Enforces the smoothness assumption: small perturbations to data should not change the output distribution.',
    equations: [
      { label: 'Consistency Loss', latex: 'L_{cons} = \\| f(x_u + \\delta) - f(x_u) \\|^2', explanation: '\\delta: random perturbation / augmentation' },
      { label: 'Total Loss', latex: 'L = L_{supervised} + \\lambda L_{cons}', explanation: '\\lambda: weight of consistency' }
    ],
    objective: 'Minimize Supervised Loss + Consistency MSE.',
    optimizer: 'Backpropagation',
    advantages: ['State-of-the-art for image semi-supervised learning', 'Does not require pseudo-labels', 'Highly robust to adversarial attacks'],
    disadvantages: ['Requires domain-specific data augmentations', 'Harder to implement for tabular data'],
    useCases: ['Medical imaging (few labels)', 'Pi-Model', 'FixMatch'],
    dataRequirements: 'Requires meaningful data augmentation techniques.',
    hyperparameters: [
      { name: 'lambda', role: 'Weight of the consistency loss' },
      { name: 'augmentation_type', role: 'Type of noise/perturbation applied' }
    ],
    exampleIO: { input: '[Cat Image (Unlabeled)]', output: '[Network penalized if augmented versions differ]' },
    metrics: ['Accuracy'],
    implementationStatus: 'educational'
  },
  {
    id: 'teacherStudent',
    name: 'Teacher-Student Learning (Mean Teacher)',
    category: 'semi-supervised',
    subcategory: 'Deep Learning',
    problemType: ['Classification'],
    simple: 'A "Teacher" network guides a "Student" network. The Teacher is a slow-moving average of the Student.',
    howItWorks: 'The Student trains normally with gradient descent. The Teacher\'s weights are updated as an exponential moving average (EMA) of the Student\'s weights. The Student is penalized if it disagrees with the Teacher on unlabeled data.',
    mathIntuition: 'The EMA acts as a temporal ensemble, making the Teacher\'s predictions much more stable and accurate than the rapidly changing Student.',
    equations: [
      { label: 'EMA Update', latex: '\\theta_t = \\alpha \\theta_t_{prev} + (1-\\alpha) \\theta_s', explanation: '\\theta_t: Teacher weights, \\theta_s: Student weights' },
      { label: 'Distillation Loss', latex: 'L_{MSE} = \\| f(x_u, \\theta_s) - f(x_u, \\theta_t) \\|^2', explanation: 'Student must match Teacher outputs' }
    ],
    objective: 'Minimize Supervised Loss + Teacher-Student MSE.',
    optimizer: 'SGD (Student) + EMA (Teacher)',
    advantages: ['Extremely stable training', 'Produces highly accurate models with very few labels', 'SOTA architecture backbone'],
    disadvantages: ['Requires tracking two sets of weights in memory', 'Slower convergence'],
    useCases: ['Speech recognition', 'Image classification with 1% labels'],
    dataRequirements: 'Requires neural network setup.',
    hyperparameters: [
      { name: 'ema_decay', role: 'How slowly the teacher updates (e.g. 0.999)' },
      { name: 'consistency_weight', role: 'How much to trust the teacher' }
    ],
    exampleIO: { input: '[Unlabeled Data]', output: '[Student aligns with Teacher]' },
    metrics: ['Accuracy'],
    implementationStatus: 'educational'
  },

  // ==========================================
  // REINFORCEMENT - VALUE-BASED
  // ==========================================
  {
    id: 'qLearning',
    name: 'Q-Learning',
    category: 'reinforcement',
    subcategory: 'Value-Based',
    problemType: ['Control'],
    simple: 'Learns a cheat sheet (Q-table) telling it the exact value of every action in every situation.',
    howItWorks: 'An agent explores an environment (State), takes an Action, receives a Reward, and updates its Q-table. It learns the Value Function to find the optimal Policy. (Off-policy).',
    mathIntuition: 'Uses the Bellman Equation to iteratively update the Q-function. Updates use the maximum possible future reward, regardless of the current policy.',
    equations: [
      { label: 'Bellman Update', latex: 'Q(s,a) \\leftarrow Q(s,a) + \\alpha[r + \\gamma\\max_{a\'}Q(s\',a\') - Q(s,a)]', explanation: '\\alpha: learning rate, \\gamma: discount factor, r: reward' },
      { label: 'Epsilon-Greedy', latex: 'a = \\text{argmax} Q(s,a) \\text{ with prob } 1-\\epsilon \\text{ else random}', explanation: 'Exploration vs Exploitation' }
    ],
    objective: 'Learn the optimal Q-value function.',
    optimizer: 'Temporal Difference (TD) Learning',
    advantages: ['Guaranteed to converge to optimal policy', 'Simple to implement via tables', 'Off-policy (can learn from old data)'],
    disadvantages: ['Fails entirely in continuous state spaces', 'Curse of dimensionality (table gets too big)', 'Can overestimate Q-values'],
    useCases: ['Gridworld puzzles', 'Simple robotics', 'Game AI (Tic-Tac-Toe)'],
    dataRequirements: 'Discrete state and action spaces.',
    hyperparameters: [
      { name: 'alpha', role: 'Learning rate' },
      { name: 'gamma', role: 'Discount factor (importance of future rewards)' }
    ],
    exampleIO: { input: '[State: Tile 4]', output: '[Action: Move Right]' },
    metrics: ['Cumulative Reward'],
    implementationStatus: 'educational'
  },
  {
    id: 'sarsa',
    name: 'SARSA',
    category: 'reinforcement',
    subcategory: 'Value-Based',
    problemType: ['Control'],
    simple: 'Like Q-learning, but learns the value of the exact path it is currently walking.',
    howItWorks: 'State, Action, Reward, State, Action. Updates the Q-value based on the specific action the current policy *actually* took next, not the theoretical maximum. (On-policy).',
    mathIntuition: 'Uses the Bellman equation, but the bootstrap target is the Q-value of the next action chosen by the current policy.',
    equations: [
      { label: 'SARSA Update', latex: 'Q(s,a) \\leftarrow Q(s,a) + \\alpha[r + \\gamma Q(s\',a\') - Q(s,a)]', explanation: 'a\' is the actual next action taken' },
      { label: 'Policy Definition', latex: '\\pi(a|s) = \\epsilon\\text{-greedy}', explanation: 'Policy must be followed for updates' }
    ],
    objective: 'Learn Q-values for the current policy.',
    optimizer: 'On-Policy TD Learning',
    advantages: ['Safer learning (avoids dangerous paths Q-learning might risk)', 'Converges well', 'Good for continuous control approximations'],
    disadvantages: ['Must learn on-policy (cannot use replay buffers effectively)', 'Slower convergence than Q-learning sometimes'],
    useCases: ['Cliff walking problems', 'Safe robotics', 'Stochastic environments'],
    dataRequirements: 'Discrete state/actions.',
    hyperparameters: [
      { name: 'alpha', role: 'Learning rate' },
      { name: 'epsilon', role: 'Exploration rate' }
    ],
    exampleIO: { input: '[S, A, R, S, A]', output: '[Updated Q-Table]' },
    metrics: ['Cumulative Reward'],
    implementationStatus: 'educational'
  },
  {
    id: 'expectedSarsa',
    name: 'Expected SARSA',
    category: 'reinforcement',
    subcategory: 'Value-Based',
    problemType: ['Control'],
    simple: 'A safer Q-learning that considers the average outcome of all possible next actions.',
    howItWorks: 'Updates Q-values based on the expected value of the next state, rather than the absolute maximum (Q-learning) or a single sampled action (SARSA).',
    mathIntuition: 'Calculates the expectation of Q(s\', a\') over the current policy distribution, eliminating the variance of single-action sampling in SARSA.',
    equations: [
      { label: 'Expected Update', latex: 'Q(s,a) \\leftarrow Q(s,a) + \\alpha[r + \\gamma \\sum_{a\'} \\pi(a\'|s\')Q(s\',a\') - Q(s,a)]', explanation: 'Sums over probabilities of all next actions' }
    ],
    objective: 'Learn robust Q-values considering policy stochasticity.',
    optimizer: 'Expected TD Learning',
    advantages: ['Lower variance than SARSA', 'Generally performs better than both Q-learning and SARSA', 'Can be on-policy or off-policy'],
    disadvantages: ['Computationally more expensive (must sum over all actions)', 'Still limited to discrete action spaces'],
    useCases: ['Stochastic puzzle games', 'Advanced tabular RL'],
    dataRequirements: 'Discrete action space required to compute expectation.',
    hyperparameters: [
      { name: 'alpha', role: 'Learning rate' },
      { name: 'gamma', role: 'Discount factor' }
    ],
    exampleIO: { input: '[State, Action]', output: '[Expected Q Update]' },
    metrics: ['Cumulative Reward'],
    implementationStatus: 'educational'
  },
  {
    id: 'dqn',
    name: 'Deep Q-Network (DQN)',
    category: 'reinforcement',
    subcategory: 'Value-Based',
    problemType: ['Control'],
    simple: 'Q-Learning where a neural network replaces the cheat sheet, allowing it to play Atari games from raw pixels.',
    howItWorks: 'Uses a Convolutional or Dense Neural Network to estimate Q-values. Solves instability using Replay Buffers and Target Networks.',
    mathIntuition: 'Minimizes MSE between the network\'s Q prediction and the Bellman target. Uses a delayed target network to stabilize gradients.',
    equations: [
      { label: 'Loss Function', latex: 'L(\\theta) = \\mathbb{E}_{(s,a,r,s\')} [(r + \\gamma \\max_{a\'} Q(s\',a\'; \\theta^-) - Q(s,a; \\theta))^2]', explanation: '\\theta: online net, \\theta^-: target net' },
      { label: 'Experience Replay', latex: 'D_t = \\{e_1, e_2, ..., e_t\\}, e_t = (s_t, a_t, r_t, s_{t+1})', explanation: 'Buffer to break correlation' }
    ],
    objective: 'Minimize TD Error using Neural Networks.',
    optimizer: 'SGD/Adam on Neural Network',
    advantages: ['Handles infinite/continuous state spaces (like images)', 'Broke the barrier for Deep RL (Atari benchmark)'],
    disadvantages: ['Cannot handle continuous action spaces', 'Prone to severe overestimation bias', 'Highly unstable hyperparameter tuning'],
    useCases: ['Atari Games', 'Discrete control tasks', 'Algorithmic trading (discrete actions)'],
    dataRequirements: 'Requires large amounts of interaction data.',
    hyperparameters: [
      { name: 'replay_buffer_size', role: 'Memory capacity' },
      { name: 'target_update_freq', role: 'How often to sync target network' }
    ],
    exampleIO: { input: '[Screen Pixels]', output: '[Joystick Action]' },
    metrics: ['Episodic Return'],
    implementationStatus: 'educational'
  },
  {
    id: 'doubleDqn',
    name: 'Double DQN',
    category: 'reinforcement',
    subcategory: 'Value-Based',
    problemType: ['Control'],
    simple: 'Fixes a bug in DQN where it gets overly optimistic about how good actions are.',
    howItWorks: 'Separates action selection from action evaluation. Uses the main network to choose the best action, but the target network to evaluate its value.',
    mathIntuition: 'Standard DQN uses `max Q(s\')`. If Q is noisy, `max` overestimates. DDQN decouples the argmax from the Q-value estimation.',
    equations: [
      { label: 'Double Q Target', latex: 'Y_t^{DoubleQ} = r_{t+1} + \\gamma Q(s_{t+1}, \\text{argmax}_a Q(s_{t+1}, a; \\theta_t); \\theta_t^-)', explanation: '\\theta selects action, \\theta^- evaluates it' }
    ],
    objective: 'Minimize TD error without overestimation bias.',
    optimizer: 'Adam on Q-Network',
    advantages: ['Eliminates massive overestimation bias of DQN', 'More stable training', 'Direct drop-in replacement for DQN'],
    disadvantages: ['Still limited to discrete actions', 'Does not solve all stability issues'],
    useCases: ['Advanced Atari playing', 'Anywhere DQN is used'],
    dataRequirements: 'Requires replay buffer.',
    hyperparameters: [
      { name: 'tau', role: 'Soft update rate for target network' },
      { name: 'batch_size', role: 'Samples per update' }
    ],
    exampleIO: { input: '[State]', output: '[Q-values]' },
    metrics: ['Return'],
    implementationStatus: 'educational'
  },
  {
    id: 'duelingDqn',
    name: 'Dueling DQN',
    category: 'reinforcement',
    subcategory: 'Value-Based',
    problemType: ['Control'],
    simple: 'A smarter network architecture that learns "how good is this state" separately from "how good is this specific action".',
    howItWorks: 'Splits the neural network into two streams: Value (V) stream and Advantage (A) stream. It combines them at the end. Useful when many actions lead to the same outcome.',
    mathIntuition: 'Q(s,a) = V(s) + A(s,a). It forces the network to learn state values explicitly, which generalizes better across actions.',
    equations: [
      { label: 'Dueling Aggregation', latex: 'Q(s,a) = V(s) + \\left(A(s,a) - \\frac{1}{|A|}\\sum_{a\'} A(s,a\')\\right)', explanation: 'Subtract mean to ensure identifiability of V' }
    ],
    objective: 'Learn Value and Advantage streams jointly.',
    optimizer: 'Adam on Network',
    advantages: ['Learns which states are valuable without having to test every action', 'Massive improvement in environments with many redundant actions'],
    disadvantages: ['Slightly more complex architecture', 'Still discrete actions only'],
    useCases: ['Autonomous driving simulators', 'Complex discrete games'],
    dataRequirements: 'Standard RL state transitions.',
    hyperparameters: [
      { name: 'hidden_sizes', role: 'Sizes of shared, V, and A layers' },
      { name: 'learning_rate', role: 'Network step size' }
    ],
    exampleIO: { input: '[State]', output: '[Value, Advantages] -> Q-values' },
    metrics: ['Return'],
    implementationStatus: 'educational'
  },

  // ==========================================
  // REINFORCEMENT - POLICY-BASED
  // ==========================================
  {
    id: 'policyGradient',
    name: 'Policy Gradient',
    category: 'reinforcement',
    subcategory: 'Policy-Based',
    problemType: ['Control'],
    simple: 'Learns to play a game by tweaking its probability of taking actions to maximize the final score, without learning Q-values.',
    howItWorks: 'Parametrizes the Policy directly (e.g., a Neural Network outputting probabilities). Plays an episode, looks at the total reward, and adjusts probabilities to make good paths more likely.',
    mathIntuition: 'Uses the Policy Gradient Theorem to calculate the gradient of expected return with respect to policy parameters.',
    equations: [
      { label: 'Objective', latex: 'J(\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta} [R(\\tau)]', explanation: 'Maximize expected reward of trajectory \\tau' },
      { label: 'Policy Gradient', latex: '\\nabla J(\\theta) = \\mathbb{E}[\\sum_{t=0}^T \\nabla_\\theta \\log \\pi_\\theta(a_t|s_t) R(\\tau)]', explanation: 'Log derivative trick' }
    ],
    objective: 'Maximize expected return directly.',
    optimizer: 'Gradient Ascent',
    advantages: ['Can handle continuous action spaces natively', 'Can learn stochastic policies (rock-paper-scissors)', 'No overestimation bias'],
    disadvantages: ['Extremely high variance (slow convergence)', 'Sample inefficient (throws away data after one use)'],
    useCases: ['Continuous robotics', 'Simple continuous control'],
    dataRequirements: 'Requires full episodes to calculate return.',
    hyperparameters: [
      { name: 'learning_rate', role: 'Step size for policy update' },
      { name: 'entropy_coef', role: 'Encourages exploration' }
    ],
    exampleIO: { input: '[State]', output: '[Probability Distribution over Actions]' },
    metrics: ['Expected Return'],
    implementationStatus: 'educational'
  },
  {
    id: 'reinforce',
    name: 'REINFORCE',
    category: 'reinforcement',
    subcategory: 'Policy-Based',
    problemType: ['Control'],
    simple: 'The most basic implementation of Policy Gradient. Plays a full game, then learns.',
    howItWorks: 'Collects a full trajectory using the current policy. Calculates the discounted return (G_t) for every step. Updates the neural network to make actions that led to high G_t more probable.',
    mathIntuition: 'A Monte Carlo approximation of the Policy Gradient. Often subtracts a baseline (like mean reward) to reduce the massive variance.',
    equations: [
      { label: 'Discounted Return', latex: 'G_t = \\sum_{k=0}^\\infty \\gamma^k r_{t+k+1}', explanation: 'Total reward from step t onwards' },
      { label: 'Update Rule', latex: '\\theta \\leftarrow \\theta + \\alpha \\gamma^t G_t \\nabla_\\theta \\log \\pi_\\theta(a_t|s_t)', explanation: 'Update parameters' }
    ],
    objective: 'Maximize G_t via Monte Carlo updates.',
    optimizer: 'Stochastic Gradient Ascent',
    advantages: ['Mathematically pure and simple', 'Handles continuous actions easily'],
    disadvantages: ['Requires waiting until the end of the episode to learn', 'Variance is so high it barely works on complex problems without baselines'],
    useCases: ['Educational RL', 'Short-episode environments (CartPole)'],
    dataRequirements: 'Episodic environments only.',
    hyperparameters: [
      { name: 'gamma', role: 'Discount factor' },
      { name: 'learning_rate', role: 'Step size' }
    ],
    exampleIO: { input: '[State]', output: '[Action Probabilities]' },
    metrics: ['Episode Reward'],
    implementationStatus: 'educational'
  },

  // ==========================================
  // REINFORCEMENT - ACTOR-CRITIC
  // ==========================================
  {
    id: 'actorCritic',
    name: 'Actor-Critic',
    category: 'reinforcement',
    subcategory: 'Actor-Critic',
    problemType: ['Control'],
    simple: 'Combines two models: an Actor that chooses actions, and a Critic that judges how good those actions are.',
    howItWorks: 'The Actor network outputs a policy (action probabilities). The Critic network learns the Value function V(s). The Critic tells the Actor if an action was better or worse than expected.',
    mathIntuition: 'Reduces the high variance of Policy Gradients by replacing the Monte Carlo return (G_t) with a learned value function estimate (TD error).',
    equations: [
      { label: 'TD Error (Critic)', latex: '\\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)', explanation: 'How much better the outcome was than expected' },
      { label: 'Actor Update', latex: '\\nabla J(\\theta) \\approx \\mathbb{E}[\\nabla_\\theta \\log \\pi_\\theta(a_t|s_t) \\delta_t]', explanation: 'Update policy using Critic\'s judgement' }
    ],
    objective: 'Train Actor to maximize Critic\'s evaluation.',
    optimizer: 'Adam (Two networks or shared base)',
    advantages: ['Lower variance than REINFORCE', 'Can learn at every step (doesn\'t wait for episode end)', 'Handles continuous actions'],
    disadvantages: ['Two networks can become unstable', 'Critic bias can misguide the Actor'],
    useCases: ['Standard Continuous Control', 'Base architecture for SOTA algorithms'],
    dataRequirements: 'Transitions (S, A, R, S).',
    hyperparameters: [
      { name: 'actor_lr', role: 'Actor learning rate' },
      { name: 'critic_lr', role: 'Critic learning rate' }
    ],
    exampleIO: { input: '[State]', output: 'Actor: [Action], Critic: [Value]' },
    metrics: ['Return', 'Value Loss'],
    implementationStatus: 'educational'
  },
  {
    id: 'a2c',
    name: 'Advantage Actor-Critic (A2C)',
    category: 'reinforcement',
    subcategory: 'Actor-Critic',
    problemType: ['Control'],
    simple: 'Multiple agents play the game at the same time and sync their learnings centrally to speed up training.',
    howItWorks: 'Synchronous version of A3C. It uses multiple parallel environments to collect data, which breaks data correlation, then calculates the Advantage (how much better an action was than average) to update the network.',
    mathIntuition: 'Advantage A(s,a) = Q(s,a) - V(s). A2C approximates this using the TD error: r + \\gamma V(s\') - V(s).',
    equations: [
      { label: 'Advantage', latex: 'A(s_t, a_t) \\approx r_t + \\gamma V(s_{t+1}) - V(s_t)', explanation: 'Advantage approximation' },
      { label: 'Loss Function', latex: 'L = L_{policy} + c_1 L_{value} - c_2 \\text{Entropy}', explanation: 'Combined objective for shared networks' }
    ],
    objective: 'Maximize Expected Advantage.',
    optimizer: 'RMSProp / Adam (Synchronous Updates)',
    advantages: ['Parallel environments stabilize training massively', 'Faster and simpler than A3C (GPUs work better with sync)', 'Good baseline'],
    disadvantages: ['Not sample efficient', 'Can get trapped in local optima'],
    useCases: ['Atari (parallelized)', 'Mujoco continuous control'],
    dataRequirements: 'Parallel environment wrappers.',
    hyperparameters: [
      { name: 'n_envs', role: 'Number of parallel workers' },
      { name: 'entropy_coef', role: 'Prevents premature convergence' }
    ],
    exampleIO: { input: '[State Batch]', output: '[Action Batch, Value Batch]' },
    metrics: ['Return'],
    implementationStatus: 'educational'
  },
  {
    id: 'a3c',
    name: 'Asynchronous Advantage Actor-Critic (A3C)',
    category: 'reinforcement',
    subcategory: 'Actor-Critic',
    problemType: ['Control'],
    simple: 'Independent agents play the game on different CPU threads and asynchronously update a global brain.',
    howItWorks: 'Instead of waiting for all agents to finish a step (A2C), A3C lets each agent run on its own thread and independently write gradient updates to a master network asynchronously.',
    mathIntuition: 'Asynchronous Hogwild! updates break correlation and explore different parts of the state space simultaneously.',
    equations: [
      { label: 'Async Update', latex: '\\theta \\leftarrow \\theta + \\alpha \\nabla_\\theta \\log \\pi_\\theta(a_t|s_t) A(s_t, a_t)', explanation: 'Applied directly to global shared parameters without locking' }
    ],
    objective: 'Maximize Advantage Asynchronously.',
    optimizer: 'Shared RMSProp / Adam',
    advantages: ['Runs fast on multi-core CPUs without a GPU', 'High exploration due to async nature'],
    disadvantages: ['Less efficient on GPUs compared to A2C', 'Code implementation is complex (threading/multiprocessing locking issues)'],
    useCases: ['Running RL on CPU clusters', 'Google DeepMind historical benchmarks'],
    dataRequirements: 'Multithreading setup.',
    hyperparameters: [
      { name: 'num_threads', role: 'Number of parallel async agents' },
      { name: 't_max', role: 'Steps before updating global network' }
    ],
    exampleIO: { input: '[State]', output: '[Action]' },
    metrics: ['Return'],
    implementationStatus: 'educational'
  },
  {
    id: 'ppo',
    name: 'Proximal Policy Optimization (PPO)',
    category: 'reinforcement',
    subcategory: 'Actor-Critic',
    problemType: ['Control'],
    simple: 'The current industry standard AI algorithm (used to train ChatGPT). It learns safely by making sure it doesn\'t change its mind too fast.',
    howItWorks: 'Collects a batch of data, then trains the network on that data for multiple epochs. To prevent breaking the policy, it uses a "clip" mechanism that prevents the new policy from deviating too much from the old policy.',
    mathIntuition: 'Maximizes a surrogate objective function that clips the probability ratio between the new and old policy, providing a trust-region optimization without the complex math of TRPO.',
    equations: [
      { label: 'Ratio', latex: 'r_t(\\theta) = \\frac{\\pi_\\theta(a_t|s_t)}{\\pi_{\\theta_{old}}(a_t|s_t)}', explanation: 'How much the policy changed' },
      { label: 'Clipped Objective', latex: 'L^{CLIP}(\\theta) = \\hat{\\mathbb{E}}_t \\left[ \\min(r_t(\\theta)\\hat{A}_t, \\text{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon)\\hat{A}_t) \\right]', explanation: 'Prevents destructively large policy updates' }
    ],
    objective: 'Maximize Clipped Surrogate Objective.',
    optimizer: 'Adam (Multiple epochs over batch)',
    advantages: ['Extremely stable and reliable', 'Sample efficient compared to A2C', 'Default choice for almost all modern RL problems (OpenAI\'s favorite)'],
    disadvantages: ['Math is somewhat complex', 'Requires tuning clip epsilon and epochs', 'Still not as sample efficient as off-policy methods'],
    useCases: ['LLM RLHF (ChatGPT)', 'Complex robotics', 'Dota 2 (OpenAI Five)'],
    dataRequirements: 'Requires Generalized Advantage Estimation (GAE).',
    hyperparameters: [
      { name: 'clip_range', role: 'Epsilon for clipping (usually 0.2)' },
      { name: 'ppo_epochs', role: 'Optimization passes over buffer' }
    ],
    exampleIO: { input: '[State]', output: '[Action, LogProb, Value]' },
    metrics: ['Return', 'Policy Loss', 'KL Divergence'],
    implementationStatus: 'educational'
  },
  {
    id: 'ddpg',
    name: 'Deep Deterministic Policy Gradient (DDPG)',
    category: 'reinforcement',
    subcategory: 'Actor-Critic',
    problemType: ['Control'],
    simple: 'DQN for continuous actions. The Actor outputs an exact continuous number, and the Critic judges that exact number.',
    howItWorks: 'Instead of outputting probabilities, the Actor outputs a deterministic action (e.g., "set steering wheel to 0.45"). The Critic takes (State, Action) and outputs Q-value. Uses Replay Buffers and Target Networks.',
    mathIntuition: 'Uses the deterministic policy gradient theorem. The Actor is updated by applying the chain rule to the learned Q-function with respect to the action.',
    equations: [
      { label: 'Critic Loss', latex: 'L(\\phi) = \\frac{1}{N} \\sum (y_i - Q_\\phi(s_i, a_i))^2, \\; y_i = r_i + \\gamma Q_{\\phi^-}(s_{i+1}, \\mu_{\\theta^-}(s_{i+1}))', explanation: 'Standard DQN-style loss' },
      { label: 'Actor Update', latex: '\\nabla_\\theta J \\approx \\frac{1}{N} \\sum \\nabla_a Q_\\phi(s, a)|_{a=\\mu_\\theta(s)} \\nabla_\\theta \\mu_\\theta(s)', explanation: 'Chain rule through Critic to Actor' }
    ],
    objective: 'Maximize Critic Q-value output via Actor.',
    optimizer: 'Adam (Actor + Critic)',
    advantages: ['Handles continuous action spaces natively', 'Off-policy (sample efficient)'],
    disadvantages: ['Notoriously unstable to train', 'Massive overestimation bias of Q-values ruins policies', 'Very sensitive to hyperparameters'],
    useCases: ['Robotic arm manipulation', 'Autonomous driving (continuous control)'],
    dataRequirements: 'Needs exploration noise (Ornstein-Uhlenbeck or Gaussian).',
    hyperparameters: [
      { name: 'tau', role: 'Soft target update rate' },
      { name: 'noise_std', role: 'Exploration noise scale' }
    ],
    exampleIO: { input: '[State]', output: 'Actor: [Exact Action Vector]' },
    metrics: ['Return', 'Q-value'],
    implementationStatus: 'educational'
  },
  {
    id: 'td3',
    name: 'Twin Delayed DDPG (TD3)',
    category: 'reinforcement',
    subcategory: 'Actor-Critic',
    problemType: ['Control'],
    simple: 'A highly patched and fixed version of DDPG that stops the AI from overestimating how good it is.',
    howItWorks: 'Fixes DDPG by: 1) Using TWO Critic networks and taking the minimum Q-value. 2) Delaying the updates of the Actor network. 3) Adding noise to the target actions to smooth Q-values.',
    mathIntuition: 'Clipped Double Q-Learning prevents overestimation. Target Policy Smoothing acts as a regularizer, forcing similar actions to have similar values.',
    equations: [
      { label: 'Clipped Double Q', latex: 'y = r + \\gamma \\min_{i=1,2} Q_{\\phi_i^-}(s\', a\' + \\epsilon)', explanation: 'Takes minimum of two critics to suppress overestimation' },
      { label: 'Target Smoothing', latex: '\\epsilon \\sim \\text{clip}(\\mathcal{N}(0, \\sigma), -c, c)', explanation: 'Adds noise to target action' }
    ],
    objective: 'Minimize Q-loss robustly, Maximize Policy.',
    optimizer: 'Adam',
    advantages: ['Massively more stable than DDPG', 'Excellent performance on continuous control', 'Off-policy and sample efficient'],
    disadvantages: ['Only works for continuous action spaces', 'Three networks to train (Actor, Critic1, Critic2)'],
    useCases: ['High-performance robotics', 'Continuous physics simulators'],
    dataRequirements: 'Off-policy replay buffer.',
    hyperparameters: [
      { name: 'policy_delay', role: 'Update Actor every N Critic updates' },
      { name: 'target_noise', role: 'Smoothing noise applied to target action' }
    ],
    exampleIO: { input: '[State]', output: '[Action]' },
    metrics: ['Return'],
    implementationStatus: 'educational'
  },
  {
    id: 'sac',
    name: 'Soft Actor-Critic (SAC)',
    category: 'reinforcement',
    subcategory: 'Actor-Critic',
    problemType: ['Control'],
    simple: 'SOTA continuous control. Learns to maximize rewards while simultaneously trying to act as randomly as possible.',
    howItWorks: 'Optimizes a maximum entropy objective. The agent wants to get high rewards, but also wants its action probabilities to remain as spread out (entropic) as possible. This causes incredibly robust exploration.',
    mathIntuition: 'Modifies the RL objective to include an entropy term ($\\mathcal{H}$). Uses twin critics like TD3 and a stochastic actor outputting mean and standard deviation of a Gaussian.',
    equations: [
      { label: 'Max Entropy Objective', latex: 'J(\\pi) = \\sum_{t=0}^T \\mathbb{E}_{(s_t,a_t)} [r(s_t,a_t) + \\alpha \\mathcal{H}(\\pi(\\cdot|s_t))]', explanation: '\\alpha: temperature parameter controlling exploration' },
      { label: 'Soft Value Function', latex: 'V(s) = \\mathbb{E}_{a \\sim \\pi} [Q(s,a) - \\alpha \\log \\pi(a|s)]', explanation: 'Value includes entropy bonus' }
    ],
    objective: 'Maximize Reward + Entropy.',
    optimizer: 'Adam (Actor + Twin Critics)',
    advantages: ['Extremely sample efficient (off-policy)', 'Highly robust due to entropy maximization', 'Requires very little hyperparameter tuning compared to DDPG/TD3'],
    disadvantages: ['Computationally heavy (outputs probability distributions, uses reparameterization trick)', 'Math is complex'],
    useCases: ['Real-world robotics (where samples are expensive)', 'Complex continuous control SOTA'],
    dataRequirements: 'Continuous spaces.',
    hyperparameters: [
      { name: 'alpha', role: 'Temperature parameter (can be auto-tuned)' },
      { name: 'tau', role: 'Soft update for targets' }
    ],
    exampleIO: { input: '[State]', output: 'Actor: [Mean, Log_Std] -> Action' },
    metrics: ['Return', 'Entropy'],
    implementationStatus: 'educational'
  }
];

export const getAlgoById = (id: string): AlgoDoc | undefined => ALGORITHM_LIBRARY.find(a => a.id === id);

# Linear Programming

> This is Great Academy's own outline, not from the reference catalog. Basis: the standard content of a first course, as in Chvátal, Vanderbei or Bertsimas and Tsitsiklis. [简体中文](linear-programming.zh-CN.md) · [math curriculum catalog](../math-curriculum.md).

- **Level:** University
- **Prerequisite(s):** Linear Algebra
- **Size:** 4 units · 8 modules · 52 topics

## Description

Optimization with linear constraints: formulating programs, the graphical and simplex methods, duality and sensitivity, modeling techniques, transportation, assignment and flow problems, integer programs and branch and bound, large programs, and matrix games.

## Outcomes

- Formulate decision problems as linear programs and read their geometry.
- Run the simplex method, including starting phases, bounds, degeneracy and the revised form.
- State and use duality, complementary slackness and sensitivity analysis.
- Solve transportation, assignment, flow and shortest-path problems.
- Solve integer programs by branch and bound and by cutting planes, and solve matrix games.
- Explain the polynomial-time methods: the ellipsoid method and barrier methods.

## Scope decisions

- Primal-dual interior-point implementations and stochastic programming belong to a second course.

## Units at a glance

| # | Unit | Modules | Topics |
|---|---|---|---|
| 1 | Foundations | 2 | 12 |
| 2 | The Simplex Method | 2 | 10 |
| 3 | Duality | 2 | 14 |
| 4 | Applications | 2 | 16 |

## Content

### 1. Foundations (12 topics)

#### 1.1. Linear Programs

1.1.1. Formulating Linear Programs  
1.1.2. Diet, Blending and Multiperiod Models  
1.1.3. Linearizing Absolute Values and Minimax  
1.1.4. Piecewise Linear Objectives  
1.1.5. Goal Programming  
1.1.6. The Graphical Method for Linear Programs  
1.1.7. Standard Form and Slack Variables  
1.1.8. Basic Feasible Solutions

#### 1.2. Geometry and Variations

1.2.1. Convex Sets and Convex Combinations  
1.2.2. Polyhedra and Extreme Points  
1.2.3. Infeasible Programs and Farkas' Lemma  
1.2.4. Minimization and Surplus Variables

### 2. The Simplex Method (10 topics)

#### 2.1. Tableaus and Pivots

2.1.1. The Simplex Tableau  
2.1.2. Pivoting in the Simplex Method  
2.1.3. The Two-Phase Method  
2.1.4. Unboundedness and Degeneracy  
2.1.5. Bland's Rule and Cycling

#### 2.2. Refinements of the Method

2.2.1. Alternative Optimal Solutions  
2.2.2. The Big M Method  
2.2.3. The Simplex Method With Bounded Variables  
2.2.4. The Complexity of Linear Programming  
2.2.5. The Ellipsoid Method

### 3. Duality (14 topics)

#### 3.1. Duality and Sensitivity

3.1.1. The Dual of a Linear Program  
3.1.2. Weak Duality  
3.1.3. Strong Duality and Complementary Slackness  
3.1.4. Barrier Methods and the Central Path  
3.1.5. Sensitivity Analysis  
3.1.6. Objective Coefficient Ranging

#### 3.2. Working With the Inverse

3.2.1. Reduced Costs  
3.2.2. The Revised Simplex Method  
3.2.3. The Tableau in Matrix Form  
3.2.4. Column Generation  
3.2.5. The Dual Simplex Method  
3.2.6. Adding a Variable or a Constraint  
3.2.7. Right-Hand Side Ranging  
3.2.8. Shadow Prices in Decisions

### 4. Applications (16 topics)

#### 4.1. Network Problems

4.1.1. The Transportation Problem  
4.1.2. Starting Plans for Transportation  
4.1.3. Improving a Transportation Plan  
4.1.4. The Assignment Problem  
4.1.5. The Hungarian Algorithm  
4.1.6. Maximum Flow and Minimum Cut  
4.1.7. Shortest Paths as Linear Programs  
4.1.8. Minimum Cost Flow  
4.1.9. The Network Simplex Method

#### 4.2. Beyond the Continuous Case

4.2.1. Integer Programming  
4.2.2. Branch and Bound  
4.2.3. The Knapsack Problem  
4.2.4. Total Unimodularity  
4.2.5. Gomory Cutting Planes  
4.2.6. Matrix Games  
4.2.7. Solving Matrix Games by Linear Programming

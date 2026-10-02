export const LEARN_TOPICS = {
  upload: {
    title: "Understanding Variables & Cleaning Data",
    stage: "Stage 1: Get & Understand Data",
    stageNumber: 1,
    studentQuestion: "What kind of data do we have, and are there any missing values?",
    plainEnglish: "Before calculating any statistics, you must know what your columns represent (continuous measurements vs discrete counts vs categories) and clean up any missing blanks so your averages don't get messed up.",
    examTip: "Exam Question Alert: Remember that quantitative variables are numbers you can do math on (Height, Marks), while qualitative variables are categories/labels (Gender, Grade level).",
    whyItMatters: "If you have missing data, dropping rows loses data, but replacing missing numbers with the mean helps keep sample size intact.",
    keyPoints: [
      "Continuous Variables: Can take any decimal value in a range (e.g. Height: 165.4 cm, Temperature: 28.3°C).",
      "Discrete Variables: Separate countable whole numbers (e.g. Number of students, Study hours rounded).",
      "Categorical Variables: Names or categories (e.g. 'Male'/'Female', 'Pass'/'Fail').",
      "Missing Values: Can be filled with the column average (mean) or dropped."
    ],
    formula: "Missing Rate (%) = (Missing Rows ÷ Total Rows) × 100%",
    formulaBreakdown: [
      { symbol: "Missing Rows", meaning: "Number of blank or empty cells in the column" },
      { symbol: "Total Rows (N)", meaning: "Total number of observations or students in the dataset" },
      { symbol: "× 100%", meaning: "Converts the fraction into an easy percentage" }
    ],
    studentExample: "If a class has 30 students and 3 students have blank test scores: (3 ÷ 30) × 100% = 10% missing rate.",
    nextTab: "frequency",
    nextLabel: "Step 2: Frequency Table"
  },
  frequency: {
    title: "Frequency Tables & Grouped Classes",
    stage: "Stage 2: Visual Distribution Shape",
    stageNumber: 2,
    studentQuestion: "How are the numbers spread across different score ranges?",
    plainEnglish: "A frequency table groups messy raw numbers into neat buckets (called 'classes' or 'bins'). It tells you how many students scored in each range (e.g. 50-60, 60-70) and what percentage that makes up.",
    examTip: "Exam Formula: Sturges' Rule k ≈ 1 + 3.322 × log₁₀(n) gives the ideal number of classes. Class mark (Xi) is always the exact middle of the class: (Lower Limit + Upper Limit) ÷ 2.",
    whyItMatters: "Instead of staring at 100 individual test scores, a frequency table lets you immediately spot which grade ranges are most common.",
    keyPoints: [
      "Class Interval [L, U): The range of values in each group (e.g. [50 to 60)).",
      "Class Mark (Xᵢ): Midpoint of the interval = (Lower Limit + Upper Limit) ÷ 2.",
      "Relative Frequency (fᵣ): The fraction of the total dataset in that bin (fᵢ ÷ N).",
      "Cumulative Frequency: The running total of observations up to that class."
    ],
    formula: "Number of Groups (k) ≈ 1 + 3.322 × log₁₀(N)  |  Midpoint (Xᵢ) = (Lower + Upper) ÷ 2  |  Relative Frequency = Count ÷ N",
    formulaBreakdown: [
      { symbol: "k (Sturges' Rule)", meaning: "Recommended number of class intervals to avoid too few or too many groups" },
      { symbol: "N", meaning: "Total number of data points / sample size" },
      { symbol: "Xᵢ (Class Mark)", meaning: "Exact middle number representing that whole group" },
      { symbol: "fᵣ (Relative Freq)", meaning: "Proportion of total students falling inside this group" }
    ],
    studentExample: "For score bracket [50 to 60): Midpoint = (50 + 60) ÷ 2 = 55. If 6 out of 30 students scored in this bracket, Relative Frequency = 6 ÷ 30 = 0.20 (20%).",
    nextTab: "histogram",
    nextLabel: "Step 3: Histogram & Bell Curve"
  },
  histogram: {
    title: "The Histogram & The Bell Curve",
    stage: "Stage 2: Visual Distribution Shape",
    stageNumber: 2,
    studentQuestion: "What does the overall shape of the data look like?",
    plainEnglish: "A histogram is a bar chart where the bars touch each other (because continuous data flows seamlessly). Taller bars mean more data points are packed into that interval.",
    examTip: "Exam Concept: Unlike a bar chart (which has gaps for categories like Fruit types), a histogram has NO GAPS between bars because it represents continuous numbers.",
    whyItMatters: "Looking at a histogram instantly tells you whether data is bell-shaped (normal), tilted to one side (skewed), or has multiple peaks (bimodal).",
    keyPoints: [
      "No gaps between bars represents continuous numerical data.",
      "The highest bar is the modal class (where most data points live).",
      "Overlaying the Normal Curve shows if your dataset behaves like a classic symmetric bell curve.",
      "Mean (dashed blue line) and Median (dashed yellow line) show which way data is being pulled."
    ],
    formula: "Bar Width (w) = (Maximum Score − Minimum Score) ÷ Number of Bars (k)",
    formulaBreakdown: [
      { symbol: "w (Bar Width)", meaning: "How wide each histogram column spans on the X-axis" },
      { symbol: "Max − Min", meaning: "Total spread / data range from highest to lowest score" },
      { symbol: "k", meaning: "How many bars you want to slice your data into" }
    ],
    studentExample: "If the highest score is 100, lowest score is 40 (Range = 60), and we choose 6 bars: Bar Width = 60 ÷ 6 = 10 marks per bar.",
    nextTab: "ogive",
    nextLabel: "Step 4: Ogive Curves"
  },
  ogive: {
    title: "Ogives & Graphical Percentiles",
    stage: "Stage 2: Visual Distribution Shape",
    stageNumber: 2,
    studentQuestion: "How can I find the median and quartiles directly from a graph without formulas?",
    plainEnglish: "An Ogive (pronounced 'oh-jive') is an S-shaped cumulative curve. It lets you easily find percentiles: for example, 'What score did 75% of the class get below?'",
    examTip: "Exam Secret: The intersection point where the Less-Than Ogive and More-Than Ogive cross is ALWAYS the exact Median (50th percentile)!",
    whyItMatters: "Teachers and grading boards use ogives to determine grade cutoffs (e.g., top 10% get an A, bottom 20% need tutoring).",
    keyPoints: [
      "Less-Than Ogive (Blue): Starts at 0% at bottom-left and rises to 100% at top-right.",
      "More-Than Ogive (Pink): Starts at 100% at top-left and drops to 0% at bottom-right.",
      "Graphical Quartiles: Look up 25% for Q₁, 50% for Median, 75% for Q₃ on the Y-axis and read across to the X-axis."
    ],
    formula: "Graphical Quartile = X-score where Cumulative % crosses Target Percentile (25% for Q₁, 50% for Median, 75% for Q₃)",
    formulaBreakdown: [
      { symbol: "Q₁ (First Quartile)", meaning: "25% of students scored at or below this value" },
      { symbol: "Median (Q₂)", meaning: "Exact middle score (50% scored below, 50% scored above)" },
      { symbol: "Q₃ (Third Quartile)", meaning: "75% of students scored at or below this value" }
    ],
    studentExample: "In a class of 40 students: find 20 students (50%) on the Y-axis, follow the horizontal line to the curve, and read down to the X-axis to get the Median score.",
    nextTab: "central_tendency",
    nextLabel: "Step 5: Central Tendency (Averages)"
  },
  central_tendency: {
    title: "Central Tendency (Mean, Median, Mode)",
    stage: "Stage 3: Core Summary Numbers",
    stageNumber: 3,
    studentQuestion: "What is the single best number to describe the typical or average value?",
    plainEnglish: "Central tendency answers: 'Where is the middle of this dataset?' We use three main tools: Mean (arithmetic average), Median (middle student in line), and Mode (most frequent score).",
    examTip: "Exam Golden Rule: When data has extreme outliers (like one student scoring 0 or a billionaire in salary survey), the MEDIAN is much more reliable than the MEAN because outliers pull the mean away!",
    whyItMatters: "If a test is easy, the mean might be 85. If a test is hard, it might be 55. Central tendency lets you summarize 1,000 scores with a single representative benchmark.",
    keyPoints: [
      "Mean (x̄): Add everything up and divide by total count n. Sensitive to extreme outliers.",
      "Median (M): The middle number (50th percentile) when sorted. Completely immune to outliers.",
      "Mode (Mo): The most frequent number. A dataset can have 1 mode, 2 modes (bimodal), or no unique mode.",
      "Trimmed Mean: Drops the top and bottom 5% of extreme values to get a robust average."
    ],
    formula: "Mean (x̄) = (Sum of All Scores) ÷ Total Count (n)  |  Median = Middle Value when Ordered",
    formulaBreakdown: [
      { symbol: "x̄ (Mean)", meaning: "Arithmetic average of all values" },
      { symbol: "Σx (Sum)", meaning: "Add up every single score in the column" },
      { symbol: "n", meaning: "Number of students / observations" },
      { symbol: "Median (M)", meaning: "Value at position (n + 1) ÷ 2 in sorted order" }
    ],
    studentExample: "For scores [10, 20, 30, 40, 50]: Sum = 150, Count = 5. Mean = 150 ÷ 5 = 30. The middle score is 30.",
    nextTab: "variability",
    nextLabel: "Step 6: Spread & Box Plots"
  },
  variability: {
    title: "Variability, Spread & Box Plots",
    stage: "Stage 3: Core Summary Numbers",
    stageNumber: 3,
    studentQuestion: "How spread out are the numbers, and are there any crazy outliers?",
    plainEnglish: "Two classes can have the exact same mean score of 70, but in Class A everyone got 68-72 (low spread), while in Class B scores ranged from 20 to 100 (high spread). Dispersion measures how spread out data is!",
    examTip: "Exam Must-Know: Why divide by (n - 1) for sample variance? This is Bessel's Correction—dividing by (n - 1) gives an unbiased estimate for the true population variance.",
    whyItMatters: "Tukey's Box Plot gives you the 'Five Number Summary' (Min, Q1, Median, Q3, Max) and flags unusual outlier students outside 1.5×IQR.",
    keyPoints: [
      "Range: Max score minus Min score (simplest measure of total spread).",
      "Standard Deviation (s): The average distance each score sits from the mean.",
      "Interquartile Range (IQR = Q₃ − Q₁): The spread of the middle 50% of the class.",
      "Tukey Outlier Rule: Any score below Q₁ − (1.5 × IQR) or above Q₃ + (1.5 × IQR) is an outlier."
    ],
    formula: "Standard Deviation (s) = √[ Sum of Squared Distances ÷ (n − 1) ]  |  IQR = Q₃ − Q₁",
    formulaBreakdown: [
      { symbol: "s (Std Dev)", meaning: "Average gap/distance of individual points from the average" },
      { symbol: "IQR", meaning: "Width of the middle 50% box in a Box Plot (Q₃ − Q₁)" },
      { symbol: "Lower Fence", meaning: "Boundary for low outliers = Q₁ − (1.5 × IQR)" },
      { symbol: "Upper Fence", meaning: "Boundary for high outliers = Q₃ + (1.5 × IQR)" }
    ],
    studentExample: "If Q₁ = 40, Q₃ = 80: IQR = 80 − 40 = 40. Upper Fence = 80 + (1.5 × 40) = 140. A score of 150 is flagged as an outlier!",
    nextTab: "skewness",
    nextLabel: "Step 7: Skewness Meter"
  },
  skewness: {
    title: "Skewness & Distribution Tilt",
    stage: "Stage 3: Core Summary Numbers",
    stageNumber: 3,
    studentQuestion: "Is the data balanced, or does it have a long tail pointing to the left or right?",
    plainEnglish: "Skewness tells you which direction the 'tail' of the data is stretched. Remember: 'The tail points in the direction of the skewness!'",
    examTip: "Easy Memory Trick: Right-Skewed (Positive) = Tail stretches right = Mean > Median. Left-Skewed (Negative) = Tail stretches left = Mean < Median. Symmetric = Mean ≈ Median.",
    whyItMatters: "Income and wealth data are almost always right-skewed (a few billionaires pull the average up). Exam scores on a very easy test are left-skewed (most score high, few score low).",
    keyPoints: [
      "Symmetric (g₁ ≈ 0): Balanced bell shape; Mean ≈ Median ≈ Mode.",
      "Right-Skewed (g₁ > +0.5): Long tail to the right; a few high values pull the Mean above the Median.",
      "Left-Skewed (g₁ < −0.5): Long tail to the left; a few low values drag the Mean below the Median.",
      "Kurtosis: Measures whether the peak is sharp and heavy-tailed (Leptokurtic) or flat (Platykurtic)."
    ],
    formula: "Pearson's Skewness (Sk₂) = 3 × (Mean − Median) ÷ Standard Deviation (s)",
    formulaBreakdown: [
      { symbol: "Sk₂ ≈ 0", meaning: "Perfect Symmetry: Mean and Median are virtually equal" },
      { symbol: "Sk₂ > +0.5", meaning: "Right-Skewed: Extreme high values pull the Mean above the Median" },
      { symbol: "Sk₂ < −0.5", meaning: "Left-Skewed: Extreme low values pull the Mean below the Median" },
      { symbol: "Kurtosis", meaning: "Peakedness (sharp tall peak vs flat spread out peak)" }
    ],
    studentExample: "If Mean = 80, Median = 70, Standard Deviation = 10: Sk₂ = 3 × (80 − 70) ÷ 10 = +3.0 (Significant Positive / Right Skew).",
    nextTab: "normality",
    nextLabel: "Step 8: Normal Distribution & Q-Q"
  },
  normality: {
    title: "Normal Distribution & Q-Q Testing",
    stage: "Stage 4: Advanced Modeling & Inferences",
    stageNumber: 4,
    studentQuestion: "Does my data qualify as a true Gaussian bell curve?",
    plainEnglish: "The Normal Distribution is the most famous curve in science. If data is normal, the Empirical Rule tells us that 68% of data is within 1 standard deviation, 95% is within 2, and 99.7% is within 3.",
    examTip: "Shapiro-Wilk Test Rule: If p-value ≥ 0.05, you FAIL to reject normality (Data looks Normal!). If p-value < 0.05, the data is significantly non-normal.",
    whyItMatters: "Many advanced statistical tests (like t-tests and ANOVA) assume data is normal. The Q-Q plot lets you visually see if points stick to the straight diagonal line.",
    keyPoints: [
      "68-95-99.7 Rule: 68.3% within μ ± 1σ, 95.5% within μ ± 2σ, 99.7% within μ ± 3σ.",
      "Q-Q Plot: If the sample points lie on the 45-degree straight line, data is normal.",
      "Shapiro-Wilk: Statistical test providing a formal p-value for normality."
    ],
    formula: "Empirical 68-95-99.7 Rule: Interval = [ Mean − k × (Std Dev)  to  Mean + k × (Std Dev) ]",
    formulaBreakdown: [
      { symbol: "k = 1 (±1 SD)", meaning: "Approximately 68.3% of all observations must fall in this band" },
      { symbol: "k = 2 (±2 SD)", meaning: "Approximately 95.5% of all observations must fall in this band" },
      { symbol: "k = 3 (±3 SD)", meaning: "Approximately 99.7% of all observations must fall in this band" },
      { symbol: "p-value ≥ 0.05", meaning: "Test passes: data is consistent with a Gaussian bell curve" }
    ],
    studentExample: "If test scores have Mean = 70 and SD = 10: 68% of students scored between 60 and 80 (70 ± 10), and 95% scored between 50 and 90 (70 ± 20).",
    nextTab: "chebyshev",
    nextLabel: "Step 9: Chebyshev's Theorem"
  },
  chebyshev: {
    title: "Chebyshev's Universal Inequality",
    stage: "Stage 4: Advanced Modeling & Inferences",
    stageNumber: 4,
    studentQuestion: "What if my data is NOT normal? How can I still guarantee how much data is within k standard deviations?",
    plainEnglish: "Chebyshev's Theorem is the ultimate safety net! Even if data is skewed, bimodal, or totally weird, Chebyshev guarantees that AT LEAST (1 − 1/k²) of observations MUST lie within k standard deviations of the mean.",
    examTip: "Exam Calculation: For k = 2, guaranteed minimum is 1 − 1/2² = 1 − 1/4 = 75%. For k = 3, guaranteed minimum is 1 − 1/3² = 88.89%. This works for ANY distribution!",
    whyItMatters: "Unlike the Empirical Rule (which only works for normal bell curves), Chebyshev works for every single quantitative dataset in existence.",
    keyPoints: [
      "Works for any distribution (no bell-curve assumption required).",
      "Valid for any k > 1 (e.g. k = 1.5, 2.0, 2.5, 3.0).",
      "Actual dataset % will ALWAYS be equal to or greater than the theoretical floor."
    ],
    formula: "Guaranteed Minimum % = (1 − 1 ÷ k²) × 100%   (for any k > 1)",
    formulaBreakdown: [
      { symbol: "k", meaning: "Number of standard deviations away from the mean (e.g. 2, 3)" },
      { symbol: "1 − 1/k²", meaning: "Mathematical lower bound percentage guaranteed to be inside" },
      { symbol: "Range", meaning: "From (Mean − k × SD) to (Mean + k × SD)" }
    ],
    studentExample: "For k = 2 standard deviations: Guaranteed Minimum = (1 − 1/4) × 100% = 75%. At least 75% of your dataset is guaranteed to be within 2 SDs of the mean!",
    nextTab: "scatter",
    nextLabel: "Step 10: Scatter & Linear Regression"
  },
  scatter: {
    title: "Scatter Plots & Linear Regression",
    stage: "Stage 4: Advanced Modeling & Inferences",
    stageNumber: 4,
    studentQuestion: "Does variable X predict or correlate with variable Y?",
    plainEnglish: "A scatter plot pairs two numeric columns (like Study Hours on the X-axis and Exam Marks on the Y-axis). The regression line (y = mx + c) gives you a prediction line for future scores!",
    examTip: "Pearson r cheat sheet: r = +1.0 (perfect positive line), r = 0 (no linear relationship), r = -1.0 (perfect negative line). r² tells you the percentage of variation explained.",
    whyItMatters: "Correlation is how data scientists predict house prices, medical outcomes, stock trends, and student success based on past observations.",
    keyPoints: [
      "Pearson's r: Measures direction and strength between -1.0 and +1.0.",
      "r² (Coefficient of Determination): The % of variance in Y accounted for by X.",
      "Line Equation (y = mx + c): m is the slope (how much Y increases per 1 unit of X), c is the Y-intercept."
    ],
    formula: "Prediction Line: ŷ = (Slope m × X) + (Intercept c)  |  Explained Variance = (r)² × 100%",
    formulaBreakdown: [
      { symbol: "m (Slope)", meaning: "Rate of change: how much Y rises/falls when X increases by 1" },
      { symbol: "c (Intercept)", meaning: "Starting value of Y when X is zero" },
      { symbol: "r (Correlation)", meaning: "Strength from -1.0 (inverse) to +1.0 (direct relationship)" },
      { symbol: "r² (%)", meaning: "Percentage of differences in Y explained by X" }
    ],
    studentExample: "If the fitted line is `Score = 5 × Hours + 30`: A student studying 8 hours is predicted to score ŷ = (5 × 8) + 30 = 70 marks.",
    nextTab: "report",
    nextLabel: "Step 11: Summary Report & PDF"
  },
  report: {
    title: "Summary Report & Academic Synthesis",
    stage: "Stage 4: Advanced Modeling & Inferences",
    stageNumber: 4,
    studentQuestion: "How do I package all my statistical findings into an executive report for submission?",
    plainEnglish: "This tab pulls together everything you've analyzed: central tendency, spread, shape, normality, and bivariate correlations into clear plain-English paragraphs and exportable tables.",
    examTip: "Use the 'Export as PDF' or 'Download CSV' buttons to instantly get your assignment-ready charts and full parameter tables!",
    whyItMatters: "Data analysis is only valuable if you can clearly communicate what the numbers mean to your teacher, teammates, or boss.",
    keyPoints: [
      "Auto-generated plain-English academic summary paragraphs.",
      "Complete descriptive and inferential parameters table.",
      "One-click PDF generation and CSV/JSON downloads."
    ],
    formula: "Final Analytical Synthesis: Combines Measures of Center (x̄, M, Mo) + Dispersion (s, IQR) + Shape (g₁, Bell Curve) + Bivariate Models (ŷ = mx + c)",
    formulaBreakdown: [
      { symbol: "Stage 1", meaning: "Data cleaning, variable categorization, and missing value treatment" },
      { symbol: "Stage 2 & 3", meaning: "Frequencies, Histograms, Ogives, Averages, Spread & Box Plots" },
      { symbol: "Stage 4", meaning: "Skewness assessment, Normality validation, Chebyshev bounds & Regression" }
    ],
    studentExample: "Export the full formatted PDF report with charts to attach directly to your homework, lab report, or slide presentation.",
    nextTab: "landing",
    nextLabel: "Return to Home Overview"
  }
};

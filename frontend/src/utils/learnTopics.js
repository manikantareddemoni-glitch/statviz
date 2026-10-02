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
    formula: "\\text{Missing Rate} = \\frac{\\text{Missing Rows}}{\\text{Total Rows}} \\times 100\\%",
    nextTab: "frequency",
    nextLabel: "Step 2: Frequency Table"
  },
  frequency: {
    title: "Frequency Tables & Grouped Classes",
    stage: "Stage 2: Visual Distribution Shape",
    stageNumber: 2,
    studentQuestion: "How are the numbers spread across different score ranges?",
    plainEnglish: "A frequency table groups messy raw numbers into neat buckets (called 'classes' or 'bins'). It tells you how many students scored in each range (e.g. 50-60, 60-70) and what percentage that makes up.",
    examTip: "Exam Formula: Sturges' Rule k ≈ 1 + 3.322 * log10(n) gives the ideal number of classes. Class mark Xi is always the exact middle of the class: (Lower + Upper) / 2.",
    whyItMatters: "Instead of staring at 100 individual test scores, a frequency table lets you immediately spot which grade ranges are most common.",
    keyPoints: [
      "Class Interval [L, U): The range of values in each group (e.g. [50 to 60)).",
      "Class Mark (Xi): Midpoint of the interval = (Lower Limit + Upper Limit) / 2.",
      "Relative Frequency (fr): The fraction of the total dataset in that bin (fi / N).",
      "Cumulative Frequency: The running total of observations up to that class."
    ],
    formula: "k \\approx 1 + 3.322 \\log_{10}(n), \\quad X_i = \\frac{L_i + U_i}{2}, \\quad f_r = \\frac{f_i}{N}",
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
    formula: "\\text{Bin Width } w = \\frac{\\text{Max} - \\text{Min}}{k}",
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
      "Less-Than Ogive: Starts at 0 at the bottom-left and rises to 100% (or N) at the top-right.",
      "More-Than Ogive: Starts at 100% (or N) at the top-left and drops to 0 at the bottom-right.",
      "Graphical Quartiles: Look up 25% for Q1, 50% for Median, 75% for Q3 on the Y-axis and read the X value."
    ],
    formula: "\\text{Median } M = \\text{X-value where Cumulative Count} = \\frac{N}{2}",
    nextTab: "central_tendency",
    nextLabel: "Step 5: Central Tendency (Averages)"
  },
  central_tendency: {
    title: "Central Tendency (Mean, Median, Mode)",
    stage: "Stage 3: Core Summary Numbers",
    stageNumber: 3,
    studentQuestion: "What is the single best number to describe the typical or average value?",
    plainEnglish: "Central tendency answers: 'Where is the middle of this dataset?' We use three main tools: Mean (arithmetic average), Median (middle student in line), and Mode (most frequent score).",
    examTip: "Exam Golden Rule: When data has extreme outliers (like a billionaire in a salary survey, or one score of 0), the MEDIAN is much more reliable than the MEAN because outliers pull the mean away!",
    whyItMatters: "If a test is easy, the mean might be 85. If a test is hard, it might be 55. Central tendency lets you summarize 1,000 scores with a single representative benchmark.",
    keyPoints: [
      "Mean (x̄): Add everything up and divide by n. Sensitive to extreme outliers.",
      "Median (M): The middle number (50th percentile). Unaffected by outliers.",
      "Mode (Mo): The most frequent number. A dataset can have 1 mode, 2 modes (bimodal), or no unique mode.",
      "Trimmed Mean: Drops the top and bottom 5% of extreme values to get a robust average."
    ],
    formula: "\\bar{x} = \\frac{\\sum x_i}{n}, \\quad M = x_{(\\frac{n+1}{2})}",
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
      "Range: Max minus Min (simplest measure of total spread).",
      "Standard Deviation (s): The average distance points sit from the mean (in original units).",
      "Interquartile Range (IQR = Q3 - Q1): The spread of the middle 50% of the class.",
      "Tukey Outlier Rule: Any score below Q1 - 1.5*IQR or above Q3 + 1.5*IQR is flagged as an outlier."
    ],
    formula: "s = \\sqrt{\\frac{\\sum(x_i - \\bar{x})^2}{n - 1}}, \\quad \\text{IQR} = Q_3 - Q_1, \\quad \\text{Fences} = Q_{1,3} \\pm 1.5 \\times \\text{IQR}",
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
      "Symmetric (g1 ≈ 0): Balanced bell shape; Mean ≈ Median ≈ Mode.",
      "Right-Skewed (g1 > 0.5): Long tail to the right; a few high values pull the Mean above the Median.",
      "Left-Skewed (g1 < -0.5): Long tail to the left; a few low values drag the Mean below the Median.",
      "Kurtosis: Measures whether the peak is sharp and heavy-tailed (Leptokurtic) or flat (Platykurtic)."
    ],
    formula: "g_1 = \\frac{\\frac{1}{n} \\sum (x_i - \\bar{x})^3}{s^3}, \\quad Sk_2 = \\frac{3(\\bar{x} - \\text{Median})}{s}",
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
    formula: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}, \\quad W = \\frac{(\\sum a_i x_{(i)})^2}{\\sum (x_i - \\bar{x})^2}",
    nextTab: "chebyshev",
    nextLabel: "Step 9: Chebyshev's Theorem"
  },
  chebyshev: {
    title: "Chebyshev's Universal Inequality",
    stage: "Stage 4: Advanced Modeling & Inferences",
    stageNumber: 4,
    studentQuestion: "What if my data is NOT normal? How can I still guarantee how much data is within k standard deviations?",
    plainEnglish: "Chebyshev's Theorem is the ultimate safety net! Even if data is skewed, bimodal, or totally weird, Chebyshev guarantees that AT LEAST (1 - 1/k²) of observations MUST lie within k standard deviations of the mean.",
    examTip: "Exam Calculation: For k = 2, guaranteed minimum is 1 - 1/2² = 1 - 1/4 = 75%. For k = 3, guaranteed minimum is 1 - 1/3² = 88.89%. This works for ANY distribution!",
    whyItMatters: "Unlike the Empirical Rule (which only works for normal bell curves), Chebyshev works for every single quantitative dataset in existence.",
    keyPoints: [
      "Works for any distribution (no bell-curve assumption required).",
      "Valid for any k > 1 (e.g. k = 1.5, 2.0, 2.5, 3.0).",
      "Actual dataset % will ALWAYS be equal to or greater than the theoretical floor."
    ],
    formula: "P(|X - \\mu| < k\\sigma) \\ge 1 - \\frac{1}{k^2} \\quad (\\text{for all } k > 1)",
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
    formula: "r = \\frac{\\text{Cov}(X,Y)}{s_x \\cdot s_y}, \\quad \\hat{y} = mx + c, \\quad r^2 = (r)^2",
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
    formula: "\\text{Complete Module I Analytical Dashboard}",
    nextTab: "landing",
    nextLabel: "Return to Home Overview"
  }
};

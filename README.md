# StatViz 📊 — Interactive Statistical Data Analysis & Visualization Platform

**StatViz** is an interactive, full-stack statistical data analysis and exploratory visualization platform built for academic study (**LG 1, Module I: Introduction to Statistics**). It combines rigorous Python computing (Pandas, SciPy, NumPy) with high-performance interactive React visualizations, rich dark/light mode aesthetics, and plain-English statistical insights.

---

## 🚀 Key Features & Module I Mapping

| Module I Topic | StatViz Feature / Tab | Theoretical & Computational Capabilities |
| :--- | :--- | :--- |
| **Data Organization & Presentation** | **1. Dataset Ingestion & Data Dictionary** | Drag-and-drop CSV upload, automated variable type inference (Continuous / Discrete / Categorical), missing value handling (dropping vs mean/mode imputation), and paginated preview. |
| **Frequency Distributions** | **2. Frequency Table** | Dynamic class intervals $[L_i, U_i)$, class marks $X_i$, frequencies $f_i$, relative frequencies $f_r$, cumulative counts, percentage distributions, and live bin width sliders (Sturges' & Freedman-Diaconis rules). |
| **Continuous Visualizations** | **3. Interactive Histogram** | Animated bar chart with live bin resolution control, fitted Gaussian Normal density curve overlay, and Mean / Median reference markers. |
| **Cumulative Polygons** | **4. Ogive Curves** | Less-Than and More-Than Ogive curves with interactive graphical percentile / quartile readers ($Q_1$, Median, $Q_3$). |
| **Exploratory Data Analysis (EDA)** | **5. Stem-and-Leaf Plot** | Tukey EDA display retaining raw data digits, custom leaf unit selector, split stem mode ($0-4 / 5-9$), depth counts, and hover value inspection. |
| **Central Tendency** | **6. Central Tendency** | Animated stat cards for Arithmetic Mean ($\bar{x}$), Median ($M$), Modes (unimodal, bimodal, multimodal, no-mode), 5% & 10% Trimmed Means, Geometric & Harmonic means, and 1D spatial number-line visualizer. |
| **Measures of Dispersion** | **7. Variability & Box Plot** | Range, Sample Variance ($s^2$, $n-1$) vs Population Variance ($\sigma^2$, $N$) toggle, Standard Deviation ($s$), Interquartile Range ($IQR$), Coefficient of Variation ($CV$), and Tukey $1.5\times IQR$ Outlier Box Plot. |
| **Universal Inequality Theorems** | **8. Chebyshev's Inequality** | Interactive $k$-slider ($k > 1$), theoretical guaranteed minimum bound ($1 - 1/k^2$), actual empirical dataset coverage, and interval highlighting on histogram. |
| **Gaussian Distribution Modeling** | **9. Normal Distribution & Q-Q** | Empirical Rule ($68\% - 95\% - 99.7\%$) evaluation vs actual coverage, Quantile-Quantile (Q-Q) plot with 45° reference line, and Shapiro-Wilk normality hypothesis test ($W$, $p$-value). |
| **Distribution Asymmetry** | **10. Skewness Analyzer** | Fisher-Pearson moment skewness ($g_1$), Pearson median skewness ($Sk_2$), excess kurtosis ($g_2$), animated speedometer needle gauge, and Mean-Median-Mode alignment diagram. |
| **Bivariate Relationships** | **11. Scatter & Linear Regression** | Quantitative variable pair selection, Pearson correlation coefficient ($r$), coefficient of determination ($r^2$), least-squares regression line ($y = mx + c$), and strength ratings. |
| **Academic Synthesis & Reporting** | **12. Summary Report & Export** | Executive plain-English insights, full descriptive metrics table, **Export as PDF** via jsPDF/html2canvas, and **Download as CSV/JSON**. |

---

## 🛠️ Technology Stack

- **Frontend**:
  - **Framework**: React 18 + Vite
  - **Styling**: Tailwind CSS (Dark Mode & Light Mode support, Glassmorphism, CSS variables)
  - **Animations**: Framer Motion (Page transitions, count-up animations, spring physics)
  - **Visualizations**: Recharts (Histograms, Ogives, Q-Q, Scatter) + Custom SVG Boxplot, Number Line & Skewness Speedometer Gauge
  - **Icons & Upload**: Lucide Icons, React Dropzone
  - **Exporting**: jsPDF, html2canvas, canvas-confetti
- **Backend**:
  - **Framework**: Python 3.11 + Flask, Flask-CORS
  - **Statistical Engines**: Pandas, NumPy, SciPy (`scipy.stats`)
  - **Testing**: Pytest (10 automated statistical test suites)

---

## 📦 Built-In Academic Sample Datasets

StatViz includes 3 pre-loaded datasets for instant demoing:
1. **Student Exam Performance (`student_marks.csv`)**: 100 students across Math, Science, and English scores, Study Hours, and Attendance.
2. **Adult Body Measurements (`heights_weights.csv`)**: 120 adults with Heights, Weights, BMI, Age, and Activity Hours.
3. **Daily Weather & Temperatures (`daily_temperatures.csv`)**: 90 daily meteorological records with Avg/Max/Min temperatures, humidity, and wind speed.

---

## ⚡ Quick Start & Run Commands

### 1. Backend Setup (Flask API)
```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```
> The Flask API will start at `http://127.0.0.1:5000` with CORS enabled.

#### Run Backend Unit Tests:
```bash
cd backend
python -m pytest tests
```

### 2. Frontend Setup (React Vite Dev Server)
```bash
cd frontend
npm install
npm run dev
```
> The React web application will start at `http://localhost:3000` (automatically proxies API requests to port 5000).

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/samples` | List all built-in sample datasets |
| `GET` | `/api/sample/<id>` | Load and inspect a sample dataset |
| `POST` | `/api/upload` | Ingest and parse user CSV file |
| `POST` | `/api/clean` | Apply missing-value treatment (`drop` or `mean`) |
| `POST` | `/api/preview` | Paginated dataset records |
| `POST` | `/api/frequency` | Frequency distribution & class intervals |
| `POST` | `/api/descriptive` | Central tendency, dispersion, and boxplot statistics |
| `POST` | `/api/ogive` | Less-than and More-than cumulative curves |
| `POST` | `/api/stem-and-leaf` | Tukey stem-and-leaf generator with leaf units |
| `POST` | `/api/chebyshev` | Chebyshev inequality bound & empirical verification |
| `POST` | `/api/normality` | Empirical rule, Shapiro-Wilk test, and Q-Q points |
| `POST` | `/api/skewness` | Moment and Pearson skewness, kurtosis, gauge angle |
| `POST` | `/api/scatter` | Bivariate Pearson $r$, $r^2$, and regression parameters |
| `POST` | `/api/report` | Plain-English summary report synthesis & export payload |

---

## 🎓 Academic "Learn Concept" Guides

Every analysis tab features an interactive **"Learn Concept"** button containing:
- Module I theoretical definition
- Exact mathematical formulas ($\LaTeX$ notation)
- Key analytical takeaways for student coursework and exam preparation.


import { useEffect, useState, type ChangeEvent } from 'react';
import './App.css';
import en from './assets/en.json';
import es from './assets/es.json';

function App() {
  interface Grade {
    grade: string;
    weight: string;
  }
  const [language, setLanguage] = useState('en');
  let lang = language == "en" ? en : es;

  const [goal, setGoal] = useState(3.0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputFields, setInputFields] = useState<Grade[]>([
    { grade: "", weight: "" }
  ]);
  const [result, setResult] = useState({
    currentGrade: 0,
    currentWeight: 0,
    remaining: 0,
    toPass: 0
  });

  useEffect(() => {
    async function load_data() {
      const savedData = await local_load();

      if (savedData) {
        setInputFields(savedData);
      }

      setIsLoaded(true);
    }

    load_data();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      local_save();
    }
  }, [inputFields, isLoaded]);

  async function local_save() {
    await chrome.storage.local.set({ data: inputFields });
  }

  async function local_load(): Promise<Grade[] | undefined> {
    const data = await chrome.storage.local.get(["data"]);
    return data.data as Grade[] | undefined;
  }


  const [error, setError] = useState("");

  function change_language() {
    setLanguage(language === 'en' ? 'es' : 'en');
  }

  function handleValueChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    const name = event.target.name as keyof Grade;

    const values = [...inputFields];

    values[index][name] = value;

    setInputFields(values);
  }

  function add_grade() {
    setInputFields([
      ...inputFields,
      { grade: "", weight: "" }
    ]);
  }

  function delete_grade(index: number) {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  }

  function calc_passing_score() {
    const validFields = inputFields.filter(
      field => field.grade !== "" && field.weight !== ""
    );

    let currentWeight = validFields.reduce(
      (accumulator, field) => accumulator + Number(field.weight), 0
    );

    let sum = 0;

    for (let i = 0; i < validFields.length; i++) {
      sum += Number(validFields[i].weight) * Number(validFields[i].grade);
    }

    if (currentWeight === 0 || currentWeight > 100) {
      setError(lang.error_weight);
      return null;
    }

    setError("");

    let currentGrade = sum / currentWeight;

    if (currentWeight == 100) {
      return setResult({
        currentGrade,
        currentWeight,
        remaining: 0,
        toPass: 0
      });
    }

    let remaining = 100 - currentWeight;

    let toPass = ((goal * 100 - currentGrade * currentWeight) / remaining);

    console.log(validFields);

    setResult({
      currentGrade,
      currentWeight,
      remaining,
      toPass
    });
  }

  return (
    <main className="app-container">

      <header className="header">
        <div className="brand">
          <div className="brand-icon">G</div>
          <span>{lang.app_name}</span>
        </div>

        <button
          className="language-button"
          onClick={change_language}
        >
          {language.toUpperCase()}
        </button>
      </header>

      <section className="intro">
        <h1>{lang.greeting}</h1>
      </section>

      <section className="goal-card">
        <label htmlFor="goal-input">
          {lang.goal_label}
        </label>

        <div className="goal-input-wrapper">
          <input
            id="goal-input"
            type="number"
            defaultValue='3'
            step='0.1'
            onChange={(e) => setGoal(Number(e.target.value))}
          />
        </div>
      </section>

      <section className="grades-section">
        <div className="section-heading">
          <h2>{lang.evaluations_title}</h2>
          <span className="evaluation-count">
            {inputFields.length}
          </span>
        </div>

        <div className="grades-header">
          <span>{lang.input_grade_placeholder}</span>
          <span>{lang.input_weight_placeholder}</span>
          <span></span>
        </div>

        <div className="grades-list">
          {inputFields.map((inputField, index) => (
            <div className="grade-row" key={index}>
              <input
                type="number"
                name="grade"
                placeholder="0.0"
                value={inputField.grade}
                onChange={(e) => handleValueChange(index, e)}
              />

              <div className="weight-input">
                <input
                  type="number"
                  name="weight"
                  placeholder="0"
                  value={inputField.weight}
                  onChange={(e) => handleValueChange(index, e)}
                />
                <span>%</span>
              </div>

              <button
                className="delete-button"
                onClick={() => delete_grade(index)}
                title={lang.delete_button}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button className="add-button" onClick={add_grade}>
          <span>+</span>
          {lang.add_button}
        </button>
      </section>

      <button
        className="calculate-button"
        onClick={calc_passing_score}
      >
        {lang.calculate_button}
      </button>

      {error && (
        <div className="error-popup">
          <span className="error-icon">!</span>
          <p>{error}</p>
          <button
            className="close-error"
            onClick={() => setError("")}
            title={lang.close_button}
          >
            ×
          </button>
        </div>
      )}

      <section className="results-section">
        <div className="results-heading">
          <h2>{lang.results_title}</h2>
        </div>

        <div className="main-result">
          <span>{lang.to_pass}</span>
          <strong>{result.toPass.toFixed(2)}</strong>
        </div>

        <div className="result-details">
          <div className="result-item">
            <span>{lang.current_grade}</span>
            <strong>{result.currentGrade.toFixed(2)}</strong>
          </div>

          <div className="result-item">
            <span>{lang.current_weight}</span>
            <strong>{result.currentWeight}%</strong>
          </div>

          <div className="result-item">
            <span>{lang.remaining}</span>
            <strong>{result.remaining}%</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;

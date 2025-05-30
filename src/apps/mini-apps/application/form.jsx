import React, { useState } from 'react';

const SurveyApp = () => {
  const [currentView, setCurrentView] = useState('menu'); // 'menu' или 'survey'
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // Список доступных анкет
  const surveys = [
    {
      id: 1,
      title: "Оценка продукта",
      icon: "📊",
      description: "test_form"
    },
    {
      id: 2,
      title: "Удовлетворенность сервисом",
      icon: "😊",
       description: "test_form"
    },
    {
      id: 3,
      title: "Маркетинговое исследование",
      icon: "🔍",
       description: "test_form"
    }
  ];

  const handleSurveySelect = (surveyId) => {
    setSelectedSurvey(surveyId);
    setCurrentView('survey');
  };

  const handleReturnToMenu = () => {
    setCurrentView('menu');
    setSelectedSurvey(null);
  };

  // Стили в GitHub-стиле

    const styles = {
        appContainer: {
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '20px',
          fontFamily: '"JetBrains Mono", monospace',
          color: '#ffffff',
          backgroundColor: '#0d1117',
          minHeight: '100vh'
        },
        header: {
          backgroundColor: '#161b22',
          color: '#ffffff',
          padding: '20px',
          borderRadius: '6px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #30363d'
        },
        companyName: {
          fontSize: '24px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          color: '#f0f6fc'
        },
        logo: {
          marginRight: '10px',
          fontSize: '28px',
          color: '#58a6ff'
        },
        searchInput: {
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #30363d',
          width: '300px',
          fontSize: '14px',
          outline: 'none',
          backgroundColor: '#0d1117',
          color: '#c9d1d9',
          fontFamily: '"JetBrains Mono", monospace',
          '&:focus': {
            borderColor: '#58a6ff',
            boxShadow: '0 0 0 3px rgba(56, 139, 253, 0.4)'
          }
        },
        menuTitle: {
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#f0f6fc'
        },
        surveysGrid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        },
        surveyCard: {
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '6px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
          color: '#f0f6fc',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 5px 15px rgba(56, 139, 253, 0.1)',
            borderColor: '#58a6ff'
          }
        },
        surveyIcon: {
          fontSize: '40px',
          marginBottom: '15px',
          textAlign: 'center',
          color: '#58a6ff'
        },
        surveyTitle: {
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '10px',
          textAlign: 'center',
          color: '#f0f6fc'
        },
        surveyDescription: {
          color: '#8b949e',
          textAlign: 'center',
          fontSize: '14px'
        }
      };
  

  if (currentView === 'menu') {
    return (
      <div style={styles.appContainer}>
        <div style={styles.header}>
          <div style={styles.companyName}>
            <span style={styles.logo}>📋</span>
            <span>AtomForm</span>
          </div>
          <input 
            type="text" 
            placeholder="Поиск анкет..." 
            style={styles.searchInput}
          />
        </div>
        
        <h2 style={styles.menuTitle}>test_form</h2>
        
        <div style={styles.surveysGrid}>
          {surveys.map(survey => (
            <div 
              key={survey.id} 
              style={styles.surveyCard}
              onClick={() => handleSurveySelect(survey.id)}
            >
              <div style={styles.surveyIcon}>{survey.icon}</div>
              <h3 style={styles.surveyTitle}>{survey.title}</h3>
              <p style={styles.surveyDescription}>{survey.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <SurveyForm 
      theme="default" 
      onReturnToMenu={handleReturnToMenu}
    />
  );
};

const SurveyForm = ({ theme, onReturnToMenu }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Как часто вы используете наш продукт?",
      options: ["Ежедневно", "Несколько раз в неделю", "Редко"]
    },
    {
      id: 2,
      question: "Насколько вы довольны нашим сервисом?",
      options: ["Очень доволен", "Удовлетворительно", "Не доволен"]
    },
    {
      id: 3,
      question: "Как вы узнали о нас?",
      options: ["Социальные сети", "Рекомендации друзей", "Реклама"]
    },
    {
      id: 4,
      question: "Какова вероятность, что вы порекомендуете нас?",
      options: ["Определенно порекомендую", "Возможно порекомендую", "Не порекомендую"]
    },
    {
      id: 5,
      question: "Что для вас наиболее важно в нашем продукте?",
      options: ["Качество", "Цена", "Удобство использования"]
    },
    {
      id: 6,
      question: "Как вы оцениваете нашу поддержку?",
      options: ["Отлично", "Средне", "Плохо"]
    },
    {
      id: 7,
      question: "Какой функционал вам не хватает?",
      options: ["Больше настроек", "Интеграции с другими сервисами", "Улучшенный дизайн"]
    },
    {
      id: 8,
      question: "Как часто вы сталкиваетесь с проблемами?",
      options: ["Никогда", "Иногда", "Часто"]
    },
    {
      id: 9,
      question: "Какой устройством вы чаще всего пользуетесь?",
      options: ["Смартфон", "Компьютер", "Планшет"]
    },
    {
      id: 10,
      question: "Какой ваш уровень удовлетворенности?",
      options: ["Высокий", "Средний", "Низкий"]
    }
  ];

  const handleOptionChange = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Ответы:", answers);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsSubmitted(false);
    onReturnToMenu();
  };

  // Стили в GitHub-стиле
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      color: '#24292e'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: 'white'
    },
    questionContainer: {
      backgroundColor: '#f6f8fa',
      border: '1px solid #e1e4e8',
      borderRadius: '6px',
      padding: '20px',
      marginBottom: '20px'
    },
    questionText: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '15px'
    },
    optionContainer: {
      marginBottom: '10px'
    },
    radioInput: {
      marginRight: '10px',
      accentColor: '#2ea44f'
    },
    radioLabel: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px'
    },
    button: {
      backgroundColor: '#2ea44f',
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      outline: 'none'
    },
    buttonDisabled: {
      backgroundColor: '#f6f8fa',
      color: '#959da5',
      cursor: 'not-allowed'
    },
    submitButton: {
      backgroundColor: '#0366d6'
    },
    completionContainer: {
      textAlign: 'center',
      padding: '40px'
    },
    checkmark: {
      color: '#2ea44f',
      fontSize: '60px',
      marginBottom: '20px'
    },
    completionText: {
      fontSize: '24px',
      marginBottom: '30px'
    },
    progress: {
      height: '5px',
      backgroundColor: '#e1e4e8',
      borderRadius: '3px',
      marginBottom: '20px'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#2ea44f',
      borderRadius: '3px',
      width: `${((currentStep + 1) / questions.length) * 100}%`,
      transition: 'width 0.3s ease'
    }
  };

  if (isSubmitted) {
    return (
      <div style={styles.container}>
        <div style={styles.completionContainer}>
          <div style={styles.checkmark}>✓</div>
          <h2 style={styles.completionText}>Спасибо за участие в опросе!</h2>
          <button 
            style={{ ...styles.button, ...styles.submitButton }} 
            onClick={resetForm}
          >
            Выйти в меню
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Анкета пользователя</h1>
      
      <div style={styles.progress}>
        <div style={styles.progressBar}></div>
      </div>
      
      <div style={styles.questionContainer}>
        <div style={styles.questionText}>
          {currentQuestion.id}. {currentQuestion.question}
        </div>
        
        {currentQuestion.options.map((option, index) => (
          <div key={index} style={styles.optionContainer}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={answers[currentQuestion.id] === option}
                onChange={() => handleOptionChange(currentQuestion.id, option)}
                style={styles.radioInput}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
      
      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.button, ...(currentStep === 0 ? styles.buttonDisabled : {}) }}
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          Назад
        </button>
        
        {currentStep < questions.length - 1 ? (
          <button
            style={{ ...styles.button, ...(!answers[currentQuestion.id] ? styles.buttonDisabled : {}) }}
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
          >
            Далее
          </button>
        ) : (
          <button
            style={{ ...styles.button, ...styles.submitButton, ...(!answers[currentQuestion.id] ? styles.buttonDisabled : {}) }}
            onClick={handleSubmit}
            disabled={!answers[currentQuestion.id]}
          >
            Отправить
          </button>
        )}
      </div>
    </div>
  );
};

export default SurveyApp;
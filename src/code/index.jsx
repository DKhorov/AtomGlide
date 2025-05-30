import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import img1 from '../img/code.gif';
import { VscNewFile, VscArrowLeft } from "react-icons/vsc";
import { FiCopy } from "react-icons/fi";
import { BiFolderOpen } from "react-icons/bi";
import Workspace from './apps/workspace';
import './style/style.scss';

const Code = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('html');
  const [showProjectsList, setShowProjectsList] = useState(false);
  const [projects, setProjects] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Проверяем, является ли устройство мобильным
    const checkIfMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    if (checkIfMobile()) {
      setIsMobile(true);
      return;
    }

    const savedProjects = JSON.parse(localStorage.getItem('projects') || '{}');
    setProjects(savedProjects);
  }, []);

  const createNewProject = (e) => {
    e.preventDefault();
    const projectId = uuidv4();

    const newProject = {
      id: projectId,
      name: projectName,
      type: projectType,
      files: {
        'index.html': '<!DOCTYPE html>\n<html>\n<head>\n\t<title>New Project</title>\n</head>\n<body>\n\n</body>\n</html>',
        'README.md': '# Project Documentation'
      }
    };

    if (projectType === 'python') {
      newProject.files = {'main.py': '# Python project\nprint("Hello World")'};
    }

    const updatedProjects = { ...projects, [projectId]: newProject };
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setActiveProject(newProject);
    setShowCreateProject(false);
  };

  const handleOpenProject = (projectId) => {
    setActiveProject(projects[projectId]);
    setShowProjectsList(false);
  };

  const handleSaveProject = (updatedProject) => {
    const updatedProjects = { ...projects, [updatedProject.id]: updatedProject };
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setActiveProject(updatedProject);
  };

  const handleCloseProject = () => {
    setActiveProject(null);
  };

  if (isMobile) {
    return (
      <div className="mobile-message">
        <h1>AtomGlide Code</h1>
        <p>Редактор кода недоступен на мобильных устройствах.</p>
        <p>Пожалуйста, используйте компьютер для работы с редактором.</p>
      </div>
    );
  }

  return (
    <div className="codes">
      <div className="panel-code">
        <div className="menu-bar">
          <span className="menu-item">Файл</span>
          <span className="menu-item">Правка</span>
          <span className="menu-item">Вид</span>
          <span className="menu-item">Справка</span>
        </div>
      </div>

      {!activeProject ? (
        <div className="codes-container">
          {!showCreateProject ? (
            <>
              <center><img src={img1} alt="Логотип AtomGlide" className="codes-logo"/></center>
              <h1 className="codes-title">AtomGlide Code</h1>
              <h4 className="codes-subtitle">Редактор кода и мастер настройки постов</h4>
              
              <div className="buttons-container">
                <button 
                  className="code-btn primary" 
                  onClick={() => setShowCreateProject(true)}
                >
                  <VscNewFile className="btn-icon"/> 
                  <span>Создать проект</span>
                </button>
                
                <button className="code-btn secondary">
                  <FiCopy className="btn-icon"/> 
                  <span>Клонировать пост</span>
                </button>
                
                <button 
                  className="code-btn tertiary"
                  onClick={() => setShowProjectsList(true)}
                >
                  <BiFolderOpen className="btn-icon"/> 
                  <span>Открыть проект</span>
                </button>
              </div>

              {showProjectsList && (
                <div className="projects-modal">
                  <h3>Ваши проекты</h3>
                  <div className="projects-list">
                    {Object.values(projects).map(project => (
                      <div 
                        key={project.id}
                        className="project-item"
                        onClick={() => handleOpenProject(project.id)}
                      >
                        {project.name} ({project.type})
                      </div>
                    ))}
                  </div>
                  <button 
                    className="close-btn"
                    onClick={() => setShowProjectsList(false)}
                  >
                    Закрыть
                  </button>
                </div>
              )}
            </>
          ) : (
            <form className="project-form" onSubmit={createNewProject}>
              <button 
                type="button"
                className="back-btn"
                onClick={() => setShowCreateProject(false)}
              >
                <VscArrowLeft className="btn-icon"/>
              </button>
              <h2 className="form-title">Новый проект</h2>
              
              <div className="form-group">
                <label htmlFor="projectName">Название</label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Тип проекта</label>
                <div className="type-selector">
                  {['html', 'markdown', 'python', 'react', 'node'].map((type) => (
                    <label key={type} className={`type-option ${projectType === type ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="projectType"
                        value={type}
                        checked={projectType === type}
                        onChange={() => setProjectType(type)}
                      />
                      {type.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="code-btn primary">
                  Создать
                </button>
                <button 
                  type="button"
                  className="code-btn secondary"
                  onClick={() => setShowCreateProject(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <Workspace 
          project={activeProject} 
          onProjectSave={handleSaveProject}
          onCloseProject={handleCloseProject}
        />
      )}

      <h4 className="code-info">
        AtomGLide Code v1.0 (Powered by Monaco Editor)
      </h4>
    </div>
  );
};

export default Code;
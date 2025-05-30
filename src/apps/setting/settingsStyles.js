import styled from '@emotion/styled';

export const SettingsContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 32px;
  color: var(--text-primary);
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 4px;
  }
`;

export const SettingsSection = styled.section`
  margin-bottom: 40px;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 24px;
  color: var(--text-primary);
`;

export const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
  width: 100%;
`;

export const ThemeOption = styled.div`
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
  border: 2px solid transparent;
  aspect-ratio: 16/9;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  &.selected {
    border-color: var(--primary-color);
  }
`;

export const ThemePreview = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  }
`;

export const ThemeName = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  z-index: 1;
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
`;

export const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3e8e41;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

export const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 500;
  }

  input {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #444;
    background-color: #2a2a2a;
    color: white;
  }
`;

export const ComingSoon = styled.span`
  color: #888;
  font-size: 0.8rem;
  margin-left: 10px;
`;

export const SoundOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SoundLabel = styled.div`
  font-weight: 500;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

export const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="radio"] {
    accent-color: #4CAF50;
  }
`;

export const ExportButton = styled(Button)`
  margin-top: 16px;
  background-color: #2196F3;

  &:hover {
    background-color: #0b7dda;
  }
`;

export const CustomThemePanel = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #444;
`;
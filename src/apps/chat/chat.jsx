import React, { useEffect, useState } from 'react';

const Chat = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [errorCode] = useState(() => {
    const codes = [
      'CRITICAL_PROCESS_DIED',
      'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED',
      'THIS_PAGE_IN_DEVELOPING',
      'PAGE_FAULT_IN_NONPAGED_AREA',
      'KERNEL_SECURITY_CHECK_FAILURE'
    ];
    return codes[Math.floor(Math.random() * codes.length)];
  });

  useEffect(() => {
    // Получаем IP пользователя
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress('UNKNOWN'));
  }, []);

  return (
    <div style={{
      backgroundColor: '#0078d7',
      color: 'white',
      fontFamily: 'Consolas, Lucida Console, monospace',
      padding: '20px',
      height: '100vh',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>:(</div>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>
          Your PC ran into a problem and needs to restart. We're just<br />
          collecting some error info, and then we'll restart for you.<br />
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <div style={{ fontSize: '14px', marginBottom: '5px' }}>
          For more information about this issue and possible fixes, visit <br />
          <span style={{ opacity: 0.6 }}>https://atomglide.com/dock</span>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <div style={{ fontSize: '14px' }}>
          If you call a support person, give them this info:<br />
          Stop code: {errorCode}<br />
          IP: {ipAddress || 'Loading...'}
        </div>
      </div>

      <div style={{ fontSize: '14px', marginBottom: '30px' }}>
        <div style={{ opacity: 0.6 }}>
          Эта старница еще в разработке пока вот вам типо BSOD делал за 5 минут думаю похоже 
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <a 
          href="https://t.me/dkdevelop" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: 'white', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
           
            <span>t.me/dkdevelop</span>
          </div>
        </a>
      </div>

      <div style={{ fontSize: '12px', opacity: 0.6 }}>
        © DK Studio 2023-2025. All rights reserved
      </div>
    </div>
  );
};

// Вспомогательная функция для отрисовки псевдопрогрессбара
function progressBar() {
  return (
    <span style={{ display: 'inline-block', width: '100px', height: '10px', border: '1px solid white', marginRight: '10px' }}>
      <span style={{ display: 'inline-block', width: '0%', height: '100%', backgroundColor: 'white' }}></span>
    </span>
  );
}

export default Chat;
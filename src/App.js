import React, { useState } from 'react';
import { Button, Form, Input, Checkbox } from 'antd';
import axios from 'axios';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [steps, setSteps] = useState(null);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const strongPasswordChecker = (password) => {
 
    const passwordLength = password.length;
    let steps = 0;
    let hasLowercase = false;
    let hasUppercase = false;
    let hasDigit = false;
    let repeatingChars = 0;
    let repeatingCharsGroups = [];
  
    for (let i = 0; i < passwordLength; i++) {
      if (!hasLowercase && /[a-z]/.test(password[i])) {
        hasLowercase = true;
      }
      if (!hasUppercase && /[A-Z]/.test(password[i])) {
        hasUppercase = true;
      }
      if (!hasDigit && /\d/.test(password[i])) {
        hasDigit = true;
      }
  
      if (i > 1 && password[i] === password[i - 1] && password[i] === password[i - 2]) {
        repeatingChars++;
      } else {
        if (repeatingChars > 0) {
          repeatingCharsGroups.push(repeatingChars);
          repeatingChars = 0;
        }
      }
    }
  
    if (repeatingChars > 0) {
      repeatingCharsGroups.push(repeatingChars);
    }
  
    const missingConditions = (hasLowercase ? 0 : 1) + (hasUppercase ? 0 : 1) + (hasDigit ? 0 : 1);
  
    if (passwordLength < 6) {
      steps = Math.max(6 - passwordLength, missingConditions);
    } else if (passwordLength <= 20) {
      steps = Math.max(missingConditions, repeatingCharsGroups.length);
    } else {
      let overLength = passwordLength - 20;
      steps = Math.max(missingConditions, repeatingCharsGroups.length) + overLength;
  
      for (let i = 0; i < repeatingCharsGroups.length && overLength > 0; i++) {
        const charsInGroup = repeatingCharsGroups[i];
  
        if (charsInGroup % 3 === 0) {
          repeatingCharsGroups[i] -= 1;
          overLength -= 1;
        }
      }
  
      for (let i = 0; i < repeatingCharsGroups.length && overLength > 0; i++) {
        const charsInGroup = repeatingCharsGroups[i];
  
        while (overLength > 0 && charsInGroup > 2) {
          repeatingCharsGroups[i] -= 1;
          overLength -= 1;
        }
  
        if (overLength > 0 && charsInGroup === 2) {
          repeatingCharsGroups[i] -= 1;
          overLength -= 1;
          steps -= 1;
        }
      }
    }
  
    return steps;
  };

  const handleCheckPasswordStrength = () => {
    setSteps(0);
    const steps = strongPasswordChecker(password);
    setSteps(steps);

  };

  const handleOnclickSubmit = async (values) => {
    try {
      // Make REST API call to save data
      const response = await axios.post('your-api-url', {username, password });
      console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error(error); // Handle the error appropriately
    }
  };
  
  const onFinishFailed = (errorInfo) => {
    // Handle form submission failure
    // ...
  };

  const validateUsername = {
    required: true,
    message: 'Please input your Username',
  };

  const validatePassword = {
    required: true,
    message: 'Please input your password!',
  }

  let button;

  if (steps === 0) {
    button = (
      <Button type="primary" onClick ={handleOnclickSubmit} className="login-form-button">
        Save
      </Button>
    );
  } else if (steps === null) {
    button = (
      <Button type="primary" htmlType="submit" className="login-form-button">
        Verify
      </Button>
    );
  } else {
    button = (
      <>
        <p>Your password is weak. Please enter a strong password.</p>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Verify
        </Button>
      </>
    );
  }
  
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700" alt="Login" />
        </div>
        <Form
          name="login-form"
          initialValues={{ remember:true }}
          onFinish={handleCheckPasswordStrength}
          onFinishFailed={onFinishFailed}
          >
          <p className="form-title">PassWord Strength checker</p>
          <p>Kindly enter your password to Verify</p>
          <Form.Item
        name="text"
        rules={[{ required: true, message: 'Please input your Username' }]}
      >
        <Input
          placeholder="Userename"
          value={username}
          onChange={handleUsernameChange}
        />
      </Form.Item>
          <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
      </Form.Item>


      <Form.Item>
      
      {button}
      </Form.Item>
    </Form>
  </div>
</div>
);
}

export default App;

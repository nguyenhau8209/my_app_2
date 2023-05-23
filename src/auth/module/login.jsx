import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const Login = () => {
    const ERROR_CHECK_LIST_TYPE = {
        required: 'Bạn phải nhập trường này',
        minlength: 'Yêu cầu tối thiểu ',
        maxlength: 'Yêu cầu tối đa',
        hasOneUpperCase: 'Yêu cầu ít nhất 1 ký tự hoa',
        option: 'Yêu cầu chọn trường',
        isEmail: 'Yêu cầu đúng định dạng email',
        sex: 'Vui lòng chọn giới tính',
        maxDay: 'Vui lòng không chọn ngày lớn hơn hôm nay',
    }

    const parseValid = (validString) => {
        if (!validString) return {}
        const listValid = validString.split('|')
        return listValid.reduce((pre, curr) => {
            const [key, value = true] = curr.split(':')
            return { ...pre, [key]: value }
        }, {})
    }

    const validate = (type = 'username', value, listError = {}) => {
        let error = null

        for (let key in listError) {
            switch (key) {
                case 'required':
                    error = !value ? ERROR_CHECK_LIST_TYPE[key] : null
                    break
            }
            if (error) {
                break
            }
        }
        return error
    }
    const [listError, setListError] = useState({
        username: null,
        password: null,
    })

    const [formValue, setFormValue] = useState({
        username: null,
        password: null,
    })

    const handleInputChange = (event) => {
        const { name, value, checked } = event.target
        const inputValue = value
        const error = validate(
            name,
            inputValue,
            parseValid(event.target.dataset.valid)
        )
        setListError({ ...listError, [name]: error })
        setFormValue({ ...formValue, [name]: inputValue })
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        const username = formValue.username
        const password = formValue.password
        const pErrorLogin = document.querySelector('#pErrorLogin')
        async function postJSON(data) {
            console.log(data)
            try {
                const response = await fetch(
                    'http://3.85.3.86:9001/api/auth/login',
                    {
                        method: 'POST', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    }
                )
                const result = await response.json()
                console.log('Success:', result)
                if (result.success === false) {
                    // alert('Error:', result.success)
                    toast.error('False')
                    pErrorLogin.innerHTML = 'Username or password incorrect'
                } else {
                    // alert('Success:', result.success)
                    // setTimeout(() => {
                    //     window.location.assign("login.html")
                    // }, 2000);
                    toast.success('Success')
                    pErrorLogin.innerHTML = ''
                    console.log(pErrorLogin)
                }
            } catch (error) {
                console.error('Error:', error)
            } finally {
                // buttonELe.disabled = false;
            }
        }

        postJSON({ username, password })
        console.log(username, password)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                        type="text"
                        name="username"
                        className="form-control"
                        data-valid="required"
                        onKeyUp={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        data-valid="required"
                        onKeyUp={handleInputChange}
                    />
                </div>
                <p
                    id="pErrorLogin"
                    style={{
                        color: 'red',
                        fontSize: '14px',
                        fontStyle: 'italic',
                    }}
                ></p>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login

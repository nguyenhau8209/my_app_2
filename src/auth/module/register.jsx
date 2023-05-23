import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
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
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const maxDate = new Date(value).getTime() > new Date().getTime() - 2000

        for (let key in listError) {
            switch (key) {
                case 'required':
                    error = !value ? ERROR_CHECK_LIST_TYPE[key] : null
                    break
                case 'minlength':
                    error =
                        value.length < listError[key]
                            ? ERROR_CHECK_LIST_TYPE[key] +
                              ' ' +
                              listError[key] +
                              ' ký tự'
                            : null
                    break
                case 'hasOneUpperCase':
                    error = !/[A-Z]/.test(value)
                        ? ERROR_CHECK_LIST_TYPE[key]
                        : null
                    break
                case 'isEmail':
                    error = !regexEmail.test(value)
                        ? ERROR_CHECK_LIST_TYPE[key]
                        : null
                    break
                case 'sex':
                    error = !value ? ERROR_CHECK_LIST_TYPE[key] : null
                    break
                case 'maxDay':
                    error = maxDate ? ERROR_CHECK_LIST_TYPE[key] : null
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
        email: null,
        sex: null,
        dOB: null,
    })

    const [formValue, setFormValue] = useState({
        username: null,
        dob: null,
        sex: null,
        password: null,
        email: null,
    })

    const checkSubmit = () => {
        const buttonEle = document.getElementById('button_register')
        const hasErrors = Object.values(listError).some(
            (error) => error !== null
        )
        console.log(hasErrors)
        const hasEmptyFields = Object.values(formValue).some((value) => !value)
        if (hasErrors || hasEmptyFields) {
            buttonEle.setAttribute('disabled', 'true')
        } else {
            buttonEle.removeAttribute('disabled')
        }
    }

    const handleInputChange = (event) => {
        const { name, value, checked } = event.target
        const inputValue = value
        const error = validate(
            name,
            inputValue,
            parseValid(event.target.dataset.valid)
        )
        checkSubmit()
        setListError({ ...listError, [name]: error })
        setFormValue({ ...formValue, [name]: inputValue })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        // Xử lý gửi dữ liệu lên server
        console.log(formValue.username)
        const username = formValue.username
        const password = formValue.password
        const email = formValue.email
        const dOB = new Date(formValue.dob).getTime()
        const sex = formValue.sex
        async function postJSON(data) {
            console.log(data)
            try {
                const response = await fetch(
                    'http://3.85.3.86:9001/api/auth/sign-in',
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
                } else {
                    // alert('Success:', result.success)
                    // setTimeout(() => {
                    //     window.location.assign("login.html")
                    // }, 2000);
                    toast.success('Success')
                }
            } catch (error) {
                console.error('Error:', error)
            } finally {
                // buttonELe.disabled = false;
            }
        }

        postJSON({ username, dOB, sex, email, password })
        console.log(username, dOB, sex, email, password)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Tên đăng nhập</label>
                <input
                    type="text"
                    name="username"
                    className="form-control"
                    onKeyUp={handleInputChange}
                    data-valid="required|minlength:6"
                />
                {listError.username && (
                    <p
                        style={{
                            color: 'red',
                            fontSize: '14px',
                            fontStyle: 'italic',
                        }}
                    >
                        {listError.username}
                    </p>
                )}
            </div>
            <div className="form-group">
                <label>Mật khẩu</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    onKeyUp={handleInputChange}
                    data-valid="required|minlength:8|hasOneUpperCase"
                />
                {listError.password && (
                    <p
                        style={{
                            color: 'red',
                            fontSize: '14px',
                            fontStyle: 'italic',
                        }}
                    >
                        {listError.password}
                    </p>
                )}
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="text"
                    name="email"
                    className="form-control"
                    onKeyUp={handleInputChange}
                    data-valid="required|isEmail"
                />
                {listError.email && (
                    <p
                        style={{
                            color: 'red',
                            fontSize: '14px',
                            fontStyle: 'italic',
                        }}
                    >
                        {listError.email}
                    </p>
                )}
            </div>
            <div className="form-group">
                <label>Giới tính</label>
                <div className="form-check">
                    <input
                        type="radio"
                        name="sex"
                        className="form-check-input"
                        value="male"
                        onClick={handleInputChange}
                        data-valid="required"
                    />
                    <label>Nam</label>
                </div>
                <div className="form-check">
                    <input
                        type="radio"
                        name="sex"
                        className="form-check-input"
                        value="feMale"
                        onClick={handleInputChange}
                        data-valid="required"
                    />
                    <label>Nữ</label>
                </div>
                {listError.sex && (
                    <p
                        style={{
                            color: 'red',
                            fontSize: '14px',
                            fontStyle: 'italic',
                        }}
                    >
                        {listError.sex}
                    </p>
                )}
            </div>
            <div className="form-group">
                <label>Ngày sinh</label>
                <input
                    type="date"
                    name="dob"
                    className="form-control"
                    onChange={handleInputChange}
                    data-valid="required|maxDay"
                />
                {listError.dOB && (
                    <p
                        style={{
                            color: 'red',
                            fontSize: '14px',
                            fontStyle: 'italic',
                        }}
                    >
                        {listError.dOB}
                    </p>
                )}
            </div>
            <button id="button_register" className="btn btn-primary">
                Đăng ký
            </button>
            <ToastContainer />
        </form>
    )
}

export default Register

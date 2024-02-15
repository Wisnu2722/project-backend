 const validateTokenRequest = (req, res, next) => {
    const errors = {}

    if (!req.body.email) {
        errors.email = 'Email is required'
    }

    // validate valid email
    if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
        errors.email = 'Must be a valid email'
    }

    if (!req.body.password) {
        errors.password = 'Password is required'
    }

    if (Object.keys(errors).length > 0) {
        return res.status(422).json(errors)
    }

    next()
}

export default validateTokenRequest
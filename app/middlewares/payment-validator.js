
/**
 * The `validatePaymentRequest` function is a middleware function in JavaScript that validates a
 * payment request object and returns any errors encountered during the validation process.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object. It is used to send the response back to the
 * client.
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the request-response cycle. It is typically used to move to the next middleware function or to the
 * final route handler.
 * @returns If there are any errors in the `errors` object, the function will return a response with a
 * status code of 422 (Unprocessable Entity) and send the `errors` object as the response body in JSON
 * format. This allows the client to know what specific errors occurred during the validation process.
 */
const validatePaymentRequest = (req, res, next) => {
    const { amount, cardNumber, cvv, expiryMonth, expiryYear } = req.body

    const errors = {}

    if (!amount) {
        errors.amount = 'Amount is required'
    }

    // amount should be a positive number
    if (amount <= 0 || isNaN(amount)) {
        errors.amount = 'Invalid amount'
    }

    if (!cardNumber) {
        errors.cardNumber = 'Card number is required'
    }

    if (!cvv) {
        errors.cvv = 'CVV is required'
    }

    // cvv should be a 3 or 4 digit number
    if (cvv.length < 3 || cvv.length > 4 || isNaN(cvv)) {
        errors.cvv = 'Invalid CVV'
    }

    if (!expiryMonth) {
        errors.expiryMonth = 'Expiry month is required'
    }

    if (!expiryYear) {
        errors.expiryYear = 'Expiry year is required'
    }

    // expiry month and year should be in the future
    if (
        expiryYear < new Date().getFullYear() ||
        (expiryYear === new Date().getFullYear() && expiryMonth < new Date().getMonth() + 1)
    ) {
        errors.expiryYear = 'Invalid expiry month/year'
    }

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ errors })
    }

    next()
}

export default validatePaymentRequest
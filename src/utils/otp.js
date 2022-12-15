exports.generateOTP = () => {
    return Math.random().toString(20).substring(2, 9)
}
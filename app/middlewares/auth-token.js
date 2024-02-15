import prisma from '../prisma.js'
export const authToken = async (req, res, next) => {
    console.log(req.head)
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({
            message: 'Token is required'
        })
    }

    const validToken = await prisma.token.findUnique({
        where: { token },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    is_blocked: true,
                    role_id: true
                }
            }
        }
    })

    if (!validToken) {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }

    if (validToken.expires_at < new Date()) {
        return res.status(401).json({
            message: 'Expired token'
        })
    }

    if (validToken.user.is_blocked) {
        return res.status(401).json({
            message: 'Blocked user'
        })
    }

    req.user = validToken.user

    next()
}
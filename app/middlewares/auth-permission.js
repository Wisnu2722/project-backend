import prisma from "../prisma.js"

/**
+ * Authorize a user's permission for a given operation.
+ *
+ * @param {string} permission - the permission to be authorized
+ * @return {Promise<void>} - a promise that resolves to nothing
+ */


const authorizePermission = (permission) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }

        const permissionRecords = await prisma.permissionRole.findMany({
            where: { role_id: req.user.role_id },
            include: { permission: true }
        })

        const permissions = permissionRecords.map((record) => record.permission.name)

        console.log('looking for permission', permission)
        console.log('in permissions', permissions)

        if (!permissions.includes(permission)) {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }

        next()
    }
}

export default authorizePermission
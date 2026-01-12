# SERVICES

login

- Direct model access: User.find(),
- Role assumptions: none
- Ownership: N/A

logout

- Direct model access: RefreshToken.find(), matchedToken.deleteOne()
- Role assumptions: user
- Ownership: own account

register

- Direct model access: User.findOne(), User.create(),
- Role assumptions: none
- Ownership: N/A

refresh

- Direct model access: RefreshToken.find(), RefreshToken.deleteMany(), RefreshToken.deleteOne(), User.findById(), matchedToken.deleteOne()
- Role assumptions: user or admin or organiser (user above)
- Ownership: own account

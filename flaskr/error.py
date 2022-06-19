class UseNotFoundException(BaseException):
    description = 'User does not exists'


class WrongPasswordException(BaseException):
    description = 'invalid password'

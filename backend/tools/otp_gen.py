import secrets

alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"


def gen_otp(length=6):
    otp = "".join(secrets.choice(alphabet) for _ in range(length))
    return "000000"

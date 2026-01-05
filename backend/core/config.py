from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str
    redis_url: str
    secret_key: str
    jwt_algo: str
    google_api_key: str
    langsmith_api_key: str
    langsmith_tracing: str = "true"
    mail_host: str = "smtp.gmail.com"
    mail_port: int = 587
    mail_user: str
    mail_password: str
    mail_from_name: str = "Recap"


settings = Settings()  # type: ignore

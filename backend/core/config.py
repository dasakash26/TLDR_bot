from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str
    secret_key: str
    jwt_algo: str
    google_api_key: str
    langsmith_api_key: str
    langsmith_tracing: str = "true"


settings = Settings()  # type: ignore

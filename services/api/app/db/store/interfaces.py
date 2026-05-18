from typing import Any, Protocol


class DBStore(Protocol):
    def get(self, model: type[Any], **filters: Any) -> Any | None:
        ...

    def list(self, model: type[Any], **filters: Any) -> list[Any]:
        ...

    def create(self, model: type[Any], data: dict[str, Any]) -> Any:
        ...

    def update(self, model: type[Any], filters: dict[str, Any], data: dict[str, Any]) -> Any | None:
        ...

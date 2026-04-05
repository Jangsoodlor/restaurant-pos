# User module Implementation

Working Directory: `backend`

In `table` module, there's TableRepository that implements AbstractRepository, which is in turn connected to `controller`.
Now, I want YOU to improve `user` module to use the AbstractRepository as well, and update user's `controller` accordingly.

User models can be mapped to TypeVar used in AbstractRepository as follows:
- UserBase === CreateDTO
- User === Model
- UserUpdate === UpdateDTO

Additionally, write concise, comprehensive test cases and put it in `tests` module as well.

- Tests can be run by `make test`
- Development server can be run by `make dev`.
## Plan: Refactor Repository Pattern to inject Session at construction

**TL;DR:** Moving from passing `session` to every repository method to injecting it once at construction time. Store `session` as `self.session` in `AbstractRepository`, pass it via the dependency function `get_table_repository(session)`, then remove session parameters from all controller endpoints.

**Steps**

1. Modify `AbstractRepository.__init__` to accept and store session — add `session: Session` parameter and set `self.session = session`
2. Remove `session` parameter from all `AbstractRepository` methods — update `list()`, `retrieve()`, `create()`, `delete()`, `patch()` to use `self.session` instead of receiving it as parameter
3. Update `TableRepository.__init__` to accept and pass session — add `session: Session` parameter and pass it to parent class
4. Update `get_table_repository()` dependency function — add `session: SessionDep` parameter and pass it to `TableRepository(session)`
5. Update `RepoDep` in Table controller — ensure it still correctly depends on `get_table_repository` (no change needed if already using `Depends(get_table_repository)`)
6. Remove `session: SessionDep` from all Table controller endpoints — keep only the `repo: RepoDep` parameter, remove session from method signatures

**Relevant files**
- backend/common/repository.py — `AbstractRepository` class definition and all method signatures
- backend/table/repository.py — `TableRepository.__init__()` and `get_table_repository()` function
- backend/table/controller.py — All 5 endpoint definitions to remove session parameter

**Verification**
1. Run Table endpoints (POST, GET, PATCH, DELETE) via API or test script to confirm they work without direct session injection
2. Verify that session is accessible via `self.session` in repository methods (check database queries still execute)
3. Once verified for Table, this pattern is the template for future repositories (Menu, Order, etc.)

**Decisions**
- This establishes the standard dependency injection pattern for all repositories going forward
- User module will eventually adopt this once it's refactored to use `AbstractRepository`
- The change keeps business logic the same, only refactors where session comes from

**HOW TO RUN tests and stuffs**
- There are already tests that can be run by
  ```
  cd <project-root-dir>/backend
  make test
  ```
- Addtionally, if it is absolutely needed to run the development server (which shouldn't be the case), do

  ```
  make dev
  ```


**THINGS THAT SHOULD'T BE DONE**
- Modifying test_table.py without asking for my explicit permission.

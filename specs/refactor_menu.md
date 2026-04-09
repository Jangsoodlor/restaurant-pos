In menu module, want to combine MenuModifier and MenuItem tables together to be something looking like this:

```py
class MenuItemType(str, Enum):
    ITEM = "item"
    MODIFIER = "modifier"

class MenuItem(MenuBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    type: MenuItemType = Field(default=MenuItemType.ITEM)
```

The reason is that both table is literally identical. Now, your job is to refactor the endpoint
and ensure that it passed the tests (in theory, you should not have to fix the tests).
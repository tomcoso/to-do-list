#### Taskgroup

- **Taskgroup.info.\*** : Access taskgroup properties by CRUD methods of the info object

- **Taskgroup.createTask(array)** : Creates a task and passes the array to create the 
    tasks' info object, adds the task to the \[tasks\] array

- **Taskgroup.getTasks** : Returns \[tasks\] array

- **Taskgroup.deleteTask(task)** : Deletes a task from \[tasks\]

- **Taskgroup.find(title)** : Finds a task in \[tasks\] using it's title property and returns it

#### Task

- **Task.info.\*** : Access task properties by CRUD methods of the info object

- **Task.setCheckbox(obj)** : Creates a checkbox property with the passed object, each property
    on the passed object must be a boolean and correlated to the 
    checkbox's items

- **Task.updateCheckbox(item, bool)** : Updates a certain item on the checkbox property, then
    checks whether the checkbox is complete and updates
    it's completed info property

#### Info

- **obj.info.read(property)** : Returns the passed property's value

- **obj.info.update(property, value)** : Updates the passed property's value. If the passed
    property is 'completed' then it only assigns booleans. If the property is not optional
    then value cannot be falsy

- **obj.info.create(property, value)** : Creates a new property

- **obj.info.deleteProp(property)** : Sets passed property to null. Property must be optional


pragma solidity ^0.5.0;

contract TodoList {
    uint256 public taskCount = 0;
    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 id, string content, bool completed);

    constructor() public {
        createTask("Checked out MY first DAPP");
    }

    function createTask(string memory _content) public {
        taskCount += 1;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }
}

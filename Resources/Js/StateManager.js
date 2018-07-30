
var STATEMACHINE_DEBUG = false;
function EmptyState() {
    this.onEnter = function() {
        
    };
    this.update = function() {
        
    };
    this.draw = function() {
        
    };
    this.onExit = function() {
        
    };
}

function StateList() {
    var states = [];
    this.pop = function() {
        return states.pop();
    };
    this.push = function(state) {
        if(!state.name)
            state.name = state.constructor.name;
        states.push(state);
        if(STATEMACHINE_DEBUG === true)
            console.log("State Loaded - " + state.name);
    };
    this.top = function() {
        return states[states.length-1];
    };
    this.insert = function(state) {
        if (states.length === 1)
        {
            states.push(state);
        } else
        {
            states.splice(1,0,state);
        }
    };
    this.splice = function(state) {
        for (var i = 0; i < states.length; i++)
        {
            if (states[i].name === state)
            {
                states.splice(i, 1);
            }
        }
    };
    this.clear = function() {
        var length = states.length-1;
        if (length > 0)
        {
            states.splice(1,length);
        }
    };
    if(STATEMACHINE_DEBUG === true)
        console.log("StateList Created");
}

function StateStack(initial = new EmptyState()) {
    var states = new StateList();
    states.push(initial);
    this.update = function (){
        var state = states.top();
        if (state){
            state.update();
        }
        if(STATEMACHINE_DEBUG === true)
            console.log("Current State = " + states.top().name);
    };
    this.draw = function (){
        var state = states.top();
        if (state){
            state.draw();
        }
    };
    this.push = function (state) {
        states.push(state);
        if(state.onEnter)
            state.onEnter();
        if(STATEMACHINE_DEBUG === true)
            console.log(states.top().name + " State Pushed");
    };
    this.pop = function () {
        var state = states.top();
        if(state.onExit)
        {
            if(state.onExit())
            {
                if(STATEMACHINE_DEBUG === true)
                    console.log(state.name + " State Popped");
                return states.pop();
            }
            else
                console.log(state.name+"onExit returns false");
        }
        else
            return states.pop();
    };
    this.insert = function(state) {
        states.insert(state);
        if(STATEMACHINE_DEBUG === true)
                console.log(state.name + " State Inserted");
    };
    this.splice = function(state) {
        states.splice(state);
        if(STATEMACHINE_DEBUG === true)
                console.log(state + " State Spliced");
    };
    this.clear = function() {
        states.clear();
        if(STATEMACHINE_DEBUG === true)
                console.log("Stack Cleared");
    };
    this.top = function () {
        return states.top();
        if(STATEMACHINE_DEBUG === true)
            console.log("StateStack.top is " + states.top().name);
    };
    if(STATEMACHINE_DEBUG === true)
        console.log("StateStack Created");
}
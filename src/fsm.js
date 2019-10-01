class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config === undefined){
            throw Error("Config not passed");
        }
        this.__states = config["states"];
        let initState = config["initial"];
        this.__initial = initState;
        this.__prevState = initState;
        this.__state = initState;
        this.__undone;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.__state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!(state in this.__states)){
            throw Error(`Cant change to state ${state}`)
        }
        this.__prevState = this.__state;
        this.__state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let transition = this.__states[this.__state]["transitions"][event];
        if (transition === undefined){
            throw Error(`Cant trigger ${event}`)
        }
        //this.__prevState = this.__state;
        this.__prevState = this.__state;
        this.__state = transition;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.__state = this.__initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let states = Object.keys(this.__states);
        if (event === undefined){
            return states;
        }
        let res = [];
        for (let state of states){
            if (event in this.__states[state].transitions){
                res.push(state);
            }
        }
        return res;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.__state == this.__initial || this.__state == this.__prevState){
            return false;
        }
        else {
            this.__undone = this.__state;
            this.__state = this.__prevState;
            return true
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.__undone === undefined){
            return false;
        } else {
            this.__state = this.__undone;
            this.__undone = void 0;
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.__undone = void 0;
        this.__prevState = this.__state;
        return true;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
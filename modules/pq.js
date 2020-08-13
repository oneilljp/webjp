class QElem {
  constructor(pos, prio) {
    this.pos = pos;
    this.priority = prio;
  }
}

// Implementation of Minimum Priority Queue, mainly taken from
// https://www.geeksforgeeks.org/implementation-priority-queue-javascript/
export class Priority {
  constructor() {
    this.elems = [];
  }

  enqueue(pos, priority) {
    let newElem = new QElem(pos, priority);
    let added = false;

    for (let i = 0; i < this.elems.length; ++i) {
      if (this.elems[i].priority > newElem.priority) {
        this.elems.splice(i, 0, newElem);
        added = true;
        break;
      }
    }

    // Add to end if needed
    if (!added) {
      this.elems.push(newElem);
    }
  }

  dequeue() {
    return this.elems.shift().pos;
  }

  empty() {
    return this.elems.length === 0;
  }

  front() {
    if (!this.empty()) {
      return this.elems[0];
    }
  }

  contains(item) {
    for (let i = 0; i < this.elems.length; ++i) {
      if (this.elems[i].pos.equals(item)) {
        return true;
      }
    }
    return false;
  }
}

// a class to describe a population of "creatures"

//initialize the population

class Population{
  constructor(m, num){
    this.mutationRate = m; //mutation rate
    this.population = new Array(num); //array to hold the current population
    this.matingPool = []; // arraylist which we will use for our "mating pool"
    this.generations = 0; //number of generations
    //make a new set of creatures
    for(let i = 0; i < this.population.length; i++){
      let position = createVector(width / 2, height + 20);
      this.population[i] = new Rocket(position, new DNA(), this.population.length);
    }
  }

  live(os){
    //for every creature
    for(let i = 0; i < this.population.length; i++){
      //if it finishes, mark it down as done !
      this.population[i].checkTarget();
      this.population[i].run(os);
    }
  }

  //did anything finish ?
  targetReached(){
    for(let i = 0; i < this.population.length; i++){
      if(this.population[i].hitTarget){
        return true;
      }
    }
    return false;
  }

  //calculate fitness for each creature
  calcFitness(){
    for(let i = 0; i < this.population.length; i++){
      this.population[i].calcFitness();
    }
  }

  //generate a mating pool
  selection(){
    //clear the arraylist
    this.matingPool = [];

    //calculate total fitness of whole population
    let maxFitness = this.getMaxFitness();

    //calculate fitness for each member of the population (scaled to value between 0 and 1)
    //based on fitness, each member will get added to the mating pool a certain number of times
    //a higher fitness = more entries to mating pool = more likely to be picked as a parent
    //a lower fitness = fewer entries to mating pool = less likely to be picked as a parent
    for(let i = 0; i < this.population.length; i++){
      let fitnessNormal = map(this.population[i].getFitness(), 0, maxFitness, 0, 1);
      let n = int(fitnessNormal * 100); //arbitrary multiplier
      for(let j = 0; j < n; j++){
        this.matingPool.push(this.population[i]);
      }
    }
  }

  //making the next generation
  reproduction(){
    for(let i = 0; i < this.population.length; i++){
      //spin the wheel of fortune to pick 2 parents
      let m = int(random(this.matingPool.length));
      let d = int(random(this.matingPool.length));
      //pick 2 parents
      let mom = this.matingPool[m];
      let dad = this.matingPool[d];
      //get their genes
      let momgenes = mom.getDNA();
      let dadgenes = dad.getDNA();
      //mate their genes
      let child = momgenes.crossover(dadgenes);
      //mutate their genes
      child.mutate(this.mutationRate);
      //fill the new population with the new child
      let position = createVector(width / 2, height + 20);
      this.population[i] = new Rocket(position, child, this.population.length);
    }
    this.generations++;
  }

  getGenerations() {
    return this.generations;
  }

  //find the highest fitness for the population
  getMaxFitness(){
    let record = 0;
    for(let i = 0; i < this.population.length; i++){
      if(this.population[i].getFitness() > record){
        record = this.population[i].getFitness();
      }
    }
    return record;
  }
}

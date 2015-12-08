from agent import Agent
from coalition import Coalition
import random

class Game():
    def __init__(self):
        self.agents = []
        self.coalitions = []
        self.allegianceMap = {}
        self.numPlayers = 0
        self.timestep = 0

    def start(self):
        self.getPlayers()
        self.initState()
        self.printGame()

        while(True):
            playerTurn = self.timestep % self.numPlayers
            print "[GAME] TS = %d; Turn = Player %d" %(self.timestep, playerTurn)

            userAction = self.getFromJS()
            print "Player %s: %s" %(self.agents[playerTurn].name, userAction)
            self.timestep+=1 

    def turn(self):
        pass
        
    def getFromJS(self):
        myinput = raw_input()
        return myinput

    def getPlayers(self):
        print "Enter number of players: "
        self.numPlayers = int(self.getFromJS())

        if self.numPlayers == 0 or self.numPlayers > 8:
            return False

        for player in xrange(self.numPlayers):
            print "Enter player %d name: " % player
            playerName = self.getFromJS()

            agent = Agent(playerName)
            self.agents.append(agent)

    def printGame(self):
        status = {"agents":self.agents, "coalitions":self.coalitions, "allegiance":self.allegianceMap}
        print status


    def initState(self):
        initWealth = self.numPlayers*100
        initPowerRatio = 5
        initShare = [random.normalvariate(100,50) for x in xrange(self.numPlayers)]
        

        share = [s/sum(initShare) for s in initShare]
        totWealth = random.randint(.8*initWealth, 1.2 *initWealth)

        for i, agent in enumerate(self.agents):
            agent.wealth = share[i] * totWealth
            agent.power = agent.wealth * initPowerRatio
        

if __name__ == "__main__":

    app = Game()
    app.start()

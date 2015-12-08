import agent
import json


class Coalition():
	def __init__(self,num,leader):
		self.id = num
		self.leader = leader
		self.agents = [leader]
		self.wealth = leader.power
		self.power = leader.wealth

	def addAgent(self,agent):
		if agent in self.agents:
			return False

		self.wealth += agent.wealth
		self.power += agent.power

		self.agents.append(agent)

		return True

	def removeAgent(self,agent):
		if agent not in self.agents:
			return False

		self.wealth -= agent.wealth
		self.power -= agent.power

		self.agents.remove(agent)

		return True

	def update(self):
		self.wealth = sum([a.wealth for a in self.agents])
		self.power = sum([a.power for a in self.agents])


	def __repr__(self):
		return json.dumps({"Coalition":self.num, "Status":{"Power":self.power, "Wealth":self.wealth, "Leader":self.leader,"Size":len(self.agents)}})



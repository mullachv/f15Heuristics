import coalition
import json

class Agent():
	def __init__(self, playerName):
		self.name = playerName
		self.power = 0
		self.wealth = 0
		self.coalition = None
		self.coalitionId = "None"

	def __repr__(self):
		coalitionId = "None" if self.coalition is None else self.coalition.id
		# return "Agent \"%s\": Power = %d Wealth = %d Coalition = %s" %(self.name, self.power, self.wealth, coalitionId)
		return json.dumps({"Agent":self.name, "Status":{"Power":self.power, "Wealth":self.wealth, "Coalition":coalitionId}})
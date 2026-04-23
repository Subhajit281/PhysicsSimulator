#pragma once
#include <SFML/Graphics.hpp>

class Ball
{
private:
	sf::CircleShape shape;
	float velocityY;
	float velocityX;
	float coeff;
public:
	Ball(float x, float y, float radius, float x_vel, float y_vel, float e);

	void setColor(sf::Color color);

	void updateY(float gravity, float dt);

	void draw(sf::RenderWindow& window);

	void updateX(float dt);

	bool checkCollision(Ball& other);

	void resolveCollision(Ball& other);
	
	void runBallSimulation(sf::RenderWindow& window);

};

#pragma once
#include <SFML/Graphics.hpp>
#include <vector>

class Boid {
public:
    sf::Vector2f position;
    sf::Vector2f velocity;
    sf::Vector2f acceleration;

    float maxSpeed;
    float maxForce;

    sf::CircleShape shape;

    Boid(float x, float y);

    void update(float dt);
    void applyForce(sf::Vector2f force);
    void edges(int width, int height);

    void flock(const std::vector<Boid>& boids);

    sf::Vector2f separation(const std::vector<Boid>& boids);
    sf::Vector2f alignment(const std::vector<Boid>& boids);
    sf::Vector2f cohesion(const std::vector<Boid>& boids);

    void draw(sf::RenderWindow& window);
};
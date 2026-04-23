#include "Boid.h"
#include <cmath>
#include <cstdlib>

// -------- Helper functions --------
float magnitude(sf::Vector2f v) {
    return std::sqrt(v.x * v.x + v.y * v.y);
}

sf::Vector2f normalize(sf::Vector2f v) {
    float mag = magnitude(v);
    if (mag == 0) return {0, 0};
    return v / mag;
}

sf::Vector2f limit(sf::Vector2f v, float max) {
    if (magnitude(v) > max)
        return normalize(v) * max;
    return v;
}
// ----------------------------------

Boid::Boid(float x, float y) {
    position = {x, y};
    velocity = {(float)(rand() % 100 - 50), (float)(rand() % 100 - 50)};
    acceleration = {0, 0};

    maxSpeed = 100.0f;
    maxForce = 50.0f;

    shape.setRadius(3);
    shape.setFillColor(sf::Color::White);
    shape.setOrigin(3, 3);
}

void Boid::applyForce(sf::Vector2f force) {
    acceleration += force;
}

void Boid::update(float dt) {
    velocity += acceleration * dt;
    velocity = limit(velocity, maxSpeed);

    position += velocity * dt;
    acceleration = {0, 0};

    shape.setPosition(position);

    // rotate in direction of motion
    float angle = atan2(velocity.y, velocity.x) * 180 / 3.14159f;
    shape.setRotation(angle);
}

void Boid::edges(int width, int height) {
    if (position.x > width) position.x = 0;
    if (position.x < 0) position.x = width;
    if (position.y > height) position.y = 0;
    if (position.y < 0) position.y = height;
}

void Boid::flock(const std::vector<Boid>& boids) {
    sf::Vector2f sep = separation(boids);
    sf::Vector2f ali = alignment(boids);
    sf::Vector2f coh = cohesion(boids);

    sep *= 1.5f;
    ali *= 1.0f;
    coh *= 1.0f;

    applyForce(sep);
    applyForce(ali);
    applyForce(coh);
}

// -------- RULES --------

sf::Vector2f Boid::separation(const std::vector<Boid>& boids) {
    float perceptionRadius = 25;
    sf::Vector2f steering = {0, 0};
    int total = 0;

    for (const auto& other : boids) {
        float d = magnitude(other.position - position);

        if (&other != this && d < perceptionRadius) {
            sf::Vector2f diff = position - other.position;
            diff /= d;
            steering += diff;
            total++;
        }
    }

    if (total > 0) steering /= (float)total;

    if (magnitude(steering) > 0) {
        steering = normalize(steering) * maxSpeed - velocity;
        steering = limit(steering, maxForce);
    }

    return steering;
}

sf::Vector2f Boid::alignment(const std::vector<Boid>& boids) {
    float perceptionRadius = 50;
    sf::Vector2f avg = {0, 0};
    int total = 0;

    for (const auto& other : boids) {
        float d = magnitude(other.position - position);

        if (&other != this && d < perceptionRadius) {
            avg += other.velocity;
            total++;
        }
    }

    if (total > 0) {
        avg /= (float)total;
        avg = normalize(avg) * maxSpeed;

        sf::Vector2f steering = avg - velocity;
        return limit(steering, maxForce);
    }

    return {0, 0};
}

sf::Vector2f Boid::cohesion(const std::vector<Boid>& boids) {
    float perceptionRadius = 50;
    sf::Vector2f center = {0, 0};
    int total = 0;

    for (const auto& other : boids) {
        float d = magnitude(other.position - position);

        if (&other != this && d < perceptionRadius) {
            center += other.position;
            total++;
        }
    }

    if (total > 0) {
        center /= (float)total;

        sf::Vector2f desired = center - position;
        desired = normalize(desired) * maxSpeed;

        sf::Vector2f steering = desired - velocity;
        return limit(steering, maxForce);
    }

    return {0, 0};
}

// -----------------------

void Boid::draw(sf::RenderWindow& window) {
    window.draw(shape);
}
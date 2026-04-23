#include "Ball.h"
#include <cmath>
#include <utility>


Ball::Ball(float x, float y, float radius, float x_vel, float y_vel, float e)
{
    shape.setRadius(radius);
    shape.setPosition(x, y);
    shape.setOrigin(radius, radius);            // center origin for correct collision (important)

    velocityX = x_vel;
    velocityY = y_vel;
    coeff = e;
}

void Ball::setColor(sf::Color color)
{
    shape.setFillColor(color);
}

void Ball::updateX(float dt)
{
    shape.move(velocityX * dt, 0);

    float radius = shape.getRadius();
    sf::Vector2f pos = shape.getPosition();

    
    if (pos.x - radius <= 0)                    // Collision with wall!
    {
        shape.setPosition(radius, pos.y);
        velocityX = -velocityX * coeff;
    }

    
    if (pos.x + radius >= 800)
    {
        shape.setPosition(800 - radius, pos.y);
        velocityX = -velocityX * coeff;
    }
}

void Ball::updateY(float gravity, float dt)
{
    velocityY += gravity * dt;
    shape.move(0, velocityY * dt);

    float radius = shape.getRadius();
    sf::Vector2f pos = shape.getPosition();

                                                         
    if (pos.y - radius <= 0)                  // Collision with Wall!
    {
        shape.setPosition(pos.x, radius);
        velocityY = -velocityY * coeff;
    }

    if (pos.y + radius >= 600)
    {
        shape.setPosition(pos.x, 600 - radius);
        velocityY = -velocityY * coeff;
    }
}

void Ball::draw(sf::RenderWindow& window)
{
    window.draw(shape);
}


// collision checker:

bool Ball::checkCollision(Ball& other)
{
    sf::Vector2f pos1 = shape.getPosition();
    sf::Vector2f pos2 = other.shape.getPosition();

    float dx = pos2.x - pos1.x;
    float dy = pos2.y - pos1.y;

    float distSq = dx * dx + dy * dy;

    float radiusSum = shape.getRadius() + other.shape.getRadius();

    return distSq <= radiusSum * radiusSum;
}


// resolve collision algorithm (a bit advanced)

void Ball::resolveCollision(Ball& other)
{
    sf::Vector2f pos1 = shape.getPosition();
    sf::Vector2f pos2 = other.shape.getPosition();

    float dx = pos2.x - pos1.x;
    float dy = pos2.y - pos1.y;

    float dist = std::sqrt(dx * dx + dy * dy);

    if (dist == 0) return;

    float nx = dx / dist;
    float ny = dy / dist;

    // relative velocity
    float dvx = other.velocityX - velocityX;
    float dvy = other.velocityY - velocityY;

    float relVel = dvx * nx + dvy * ny;

    // If balls are moving apart, do nothing
    if (relVel > 0)
        return;

    float e = std::min(coeff, other.coeff);

    // impulse scalar (I have no idea how this is working)
    float j = -(1 + e) * relVel / 2.0f;

    float impulseX = j * nx;
    float impulseY = j * ny;

    velocityX -= impulseX;
    velocityY -= impulseY;

    other.velocityX += impulseX;
    other.velocityY += impulseY;

    // correct position
    float overlap = (shape.getRadius() + other.shape.getRadius()) - dist;

    if (overlap > 0)
    {
        const float percent = 0.8f;  // push strength
        const float slop = 0.01f;    // small tolerance

        float correction = std::max(overlap - slop, 0.0f) * percent;

        shape.move(-nx * correction / 2, -ny * correction / 2);
        other.shape.move(nx * correction / 2, ny * correction / 2);
    }
   
}
 
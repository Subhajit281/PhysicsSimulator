#include <SFML/Graphics.hpp>
#include "Ball.h"
#include <vector>
#include <cstdlib>
#include <ctime>

void runSandboxSimulation()
{
    srand(time(0));

    sf::RenderWindow window(sf::VideoMode(800, 600), "Sandbox");
    window.setFramerateLimit(60);

    std::vector<Ball> balls;

    float gravity = 1.0f;
    float xvelocity = 120.0f;
    float yvelocity = -80.0f;
    float restitution = 0.7f;

    sf::Clock clock;

    while (window.isOpen())
    {
        float dt = clock.restart().asSeconds();

        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();

            // ✅ spawn ball on click
            if (event.type == sf::Event::MouseButtonPressed)
            {
                float x = event.mouseButton.x;
                float y = event.mouseButton.y;

                Ball b(x, y, 10.0f, xvelocity, yvelocity, restitution);

                b.setColor(sf::Color(rand() % 256, rand() % 256, rand() % 256));

                balls.push_back(b);
            }
        }

        // ✅ update
        for (auto& ball : balls)
        {
            ball.updateX(dt);
            ball.updateY(gravity, dt);
        }

        // ✅ collision
        for (size_t i = 0; i < balls.size(); i++)
        {
            for (size_t j = i + 1; j < balls.size(); j++)
            {
                if (balls[i].checkCollision(balls[j]))
                {
                    balls[i].resolveCollision(balls[j]);
                }
            }
        }

        // ✅ render
        window.clear();

        for (auto& ball : balls)
        {
            ball.draw(window);
        }

        window.display();
    }
}
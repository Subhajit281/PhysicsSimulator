#include <SFML/Graphics.hpp>
#include "Ball.h"
#include <vector>
#include <cstdlib>
#include <ctime>

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Ball Physics");
    window.setFramerateLimit(60);

    sf::Clock clock;

    std::vector<Ball> balls;

    srand(time(0));

    float gravity = 1.0f;
    float xvelocity = 120.0f;
    float yvelocity = -80.0f;
    float restitution = 0.7f;

    while (window.isOpen()) {
        float dt = clock.restart().asSeconds();

        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();

            // ✅ CREATE BALL ON CLICK
            if (event.type == sf::Event::MouseButtonPressed) {
                float x = event.mouseButton.x;
                float y = event.mouseButton.y;

                Ball b(x, y, 10.0f, xvelocity, yvelocity, restitution);

                b.setColor(sf::Color(rand() % 256, rand() % 256, rand() % 256));

                balls.push_back(b);
            }
        }

        // ✅ UPDATE
        for (auto& ball : balls) {
            ball.updateX(dt);
            ball.updateY(gravity, dt);
        }

        // ✅ COLLISIONS
        for (size_t i = 0; i < balls.size(); i++) {
            for (size_t j = i + 1; j < balls.size(); j++) {
                if (balls[i].checkCollision(balls[j])) {
                    balls[i].resolveCollision(balls[j]);
                }
            }
        }

        // ✅ DRAW
        window.clear();

        for (auto& ball : balls) {
            ball.draw(window);
        }

        window.display();
    }

    return 0;
}
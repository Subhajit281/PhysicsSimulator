#include <SFML/Graphics.hpp>
#include "Boid.h"
#include <vector>
#include <cstdlib>

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Boid Simulation");
    window.setFramerateLimit(60);

    sf::Clock clock;

    std::vector<Boid> boids;

    // ✅ CREATE BOIDS
    for (int i = 0; i < 100; i++) {
        boids.push_back(Boid(rand() % 800, rand() % 600));
    }

    while (window.isOpen()) {
        float dt = clock.restart().asSeconds();

        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        // ✅ UPDATE (FLOCKING)
        for (auto& b : boids) {
            b.flock(boids);
            b.update(dt);
            b.edges(800, 600);
        }

        // ✅ DRAW
        window.clear(sf::Color::Black);

        for (auto& b : boids) {
            b.draw(window);
        }

        window.display();
    }

    return 0;
}
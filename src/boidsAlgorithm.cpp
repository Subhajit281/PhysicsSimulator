#include <SFML/Graphics.hpp>
#include "Boid.h"
#include <vector>
#include <cstdlib>

void runBoidSimulation() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Boids Simulation");
    window.setFramerateLimit(60);

    std::vector<Boid> boids;

    for (int i = 0; i < 100; i++) {
        boids.push_back(Boid(rand() % 800, rand() % 600));
    }

    sf::Clock clock;

    while (window.isOpen()) {
        float dt = clock.restart().asSeconds();

        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        for (auto& b : boids) {
            b.flock(boids);
            b.update(dt);
            b.edges(800, 600);
        }

        window.clear(sf::Color::Black);

        for (auto& b : boids)
            b.draw(window);

        window.display();
    }
}
#pragma once
#pragma once

#include "Simulation.h"
#include <SFML/Graphics.hpp>

class Friction : public Simulation
{
public:
    void run() override;

private:

    float rad(float deg);

    sf::VertexArray makeArrow(
        sf::Vector2f start,
        sf::Vector2f dir,
        sf::Color color
    );
};
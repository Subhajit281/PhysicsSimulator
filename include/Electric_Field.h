#pragma once

#include "simulation.h"
#include <SFML/Graphics.hpp>
#include <vector>

class ElectricField : public Simulation
{
public:
    void run() override;

private:

    struct Charge
    {
        sf::Vector2f pos;
        float q;
    };

    struct Particle
    {
        sf::Vector2f pos;
        sf::Vector2f vel;
    };

    float length(sf::Vector2f v);
    sf::Vector2f normalize(sf::Vector2f v);
};
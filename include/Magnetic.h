#pragma once
#pragma once

#include "simulation.h"
#include <SFML/Graphics.hpp>
#include <vector>

class Magnetic : public Simulation
{
public:
    void run() override;

private:

    struct Magnet
    {
        sf::Vector2f pos;
        float polarity;
    };
};
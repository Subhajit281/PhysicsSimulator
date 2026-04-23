#pragma once

#include "simulation.h"
#include <SFML/Graphics.hpp>
#include <vector>

class Wave : public Simulation
{
public:
    void run() override;

private:

    struct Source
    {
        sf::Vector2f position;
    };
};
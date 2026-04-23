    #pragma once
    #pragma once

    #include "Simulation.h"
    #include <SFML/Graphics.hpp>
    #include <vector>

    class Universe : public Simulation
    {
    public:
        void run() override;

    private:

        struct Body
        {
            sf::Vector2f pos;
            sf::Vector2f vel;
            float mass;
            float radius;
            bool blackhole;

            sf::CircleShape shape;
        };

        float vecLength(sf::Vector2f v);
    };
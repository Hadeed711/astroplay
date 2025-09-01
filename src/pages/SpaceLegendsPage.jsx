import React from 'react'
import { Telescope, Rocket, Star, Quote } from 'lucide-react'

const SpaceLegendsPage = () => {
  // Famous space scientists, astronauts, and astronomers data
  const spacePersonalities = [
    {
      id: 1,
      name: "Neil Armstrong",
      profession: "Astronaut & Test Pilot",
      achievement: "First person to walk on the Moon",
      imageLocation: "/images/personalities/neil-armstrong.jpg", // Add image here
      quote: "That's one small step for man, one giant leap for mankind.",
      experience: "Apollo 11 Mission Commander who made history on July 20, 1969",
      unbelievableStory: "Felt the profound silence of space and described the Moon's surface as 'magnificent desolation'"
    },
    {
      id: 2,
      name: "Carl Sagan",
      profession: "Astronomer & Astrophysicist",
      achievement: "Pioneer of exobiology and SETI",
      imageLocation: "/images/personalities/carl-sagan.jpg", // Add image here
      quote: "We are made of star stuff. We are a way for the cosmos to know itself.",
      experience: "Cosmos series host who brought astronomy to millions",
      unbelievableStory: "Calculated that humans are literally made from elements forged in the hearts of dying stars"
    },
    {
      id: 3,
      name: "Katherine Johnson",
      profession: "Mathematician & Space Scientist",
      achievement: "Calculated trajectories for Apollo missions",
      imageLocation: "/images/personalities/katherine-johnson.jpg", // Add image here
      quote: "I counted everything. I counted the steps to the road, the steps up to church, the number of dishes and silverware I washed.",
      experience: "Her precise calculations were crucial for the success of the first U.S. spaceflights",
      unbelievableStory: "John Glenn specifically requested her to verify the computer calculations for his orbital mission"
    },
    {
      id: 4,
      name: "Yuri Gagarin",
      profession: "Cosmonaut",
      achievement: "First human in space",
      imageLocation: "/images/personalities/yuri-gagarin.jpg", // Add image here
      quote: "I see Earth! It is so beautiful!",
      experience: "Completed the first human spaceflight on April 12, 1961",
      unbelievableStory: "Described seeing Earth from space as a pale blue dot suspended in cosmic darkness"
    },
    {
      id: 5,
      name: "Mae Jemison",
      profession: "Astronaut & Engineer",
      achievement: "First African American woman in space",
      imageLocation: "/images/personalities/mae-jemison.jpg", // Add image here
      quote: "Never limit yourself because of others' limited imagination; never limit others because of your own limited imagination.",
      experience: "Space Shuttle Endeavour mission specialist in 1992",
      unbelievableStory: "Brought a poster of Alvin Ailey dancers to space, connecting art and science"
    },
    {
      id: 6,
      name: "Stephen Hawking",
      profession: "Theoretical Physicist",
      achievement: "Black hole radiation theory",
      imageLocation: "/images/personalities/stephen-hawking.jpg", // Add image here
      quote: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist.",
      experience: "Revolutionized our understanding of black holes and cosmology",
      unbelievableStory: "Proved that black holes emit radiation and eventually evaporate, contradicting previous beliefs"
    },
    {
      id: 7,
      name: "Valentina Tereshkova",
      profession: "Cosmonaut",
      achievement: "First woman in space",
      imageLocation: "/images/personalities/valentina-tereshkova.jpg", // Add image here
      quote: "A bird cannot fly with one wing only. Human space flight cannot develop any further without the active participation of women.",
      experience: "Solo spaceflight aboard Vostok 6 for three days in 1963",
      unbelievableStory: "Orbited Earth 48 times, more than all U.S. astronauts combined at that time"
    },
    {
      id: 8,
      name: "Elon Musk",
      profession: "Engineer & Entrepreneur",
      achievement: "SpaceX founder revolutionizing space travel",
      imageLocation: "/images/personalities/elon-musk.jpg", // Add image here
      quote: "When something is important enough, you do it even if the odds are not in your favor.",
      experience: "Making space travel reusable and planning Mars colonization",
      unbelievableStory: "Successfully landed rockets back on Earth, something experts said was impossible"
    },
    {
      id: 9,
      name: "Edwin Hubble",
      profession: "Astronomer",
      achievement: "Discovered universe expansion",
      imageLocation: "/images/personalities/edwin-hubble.jpg", // Add image here
      quote: "Equipped with his five senses, man explores the universe around him and calls the adventure Science.",
      experience: "Proved the existence of galaxies beyond the Milky Way",
      unbelievableStory: "Discovered that the universe is expanding, fundamentally changing our cosmic perspective"
    },
    {
      id: 10,
      name: "Sally Ride",
      profession: "Astronaut & Physicist",
      achievement: "First American woman in space",
      imageLocation: "/images/personalities/sally-ride.jpg", // Add image here
      quote: "The stars don't look bigger, but they do look brighter.",
      experience: "Space Shuttle Challenger missions in 1983 and 1984",
      unbelievableStory: "Described the incredible experience of seeing Earth's thin atmosphere protecting all life"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-purple-900/20 to-space-blue/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-8 h-8 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">Space Legends</h1>
            <Telescope className="w-8 h-8 text-space-blue" />
          </div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Meet the extraordinary individuals who dared to reach for the stars and revolutionized our understanding of the cosmos
          </p>
        </div>

        {/* Personalities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spacePersonalities.map((person) => (
            <div 
              key={person.id}
              className="bg-space-dark/50 backdrop-blur-sm rounded-2xl border border-space-blue/20 p-6 hover:border-space-blue/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Image Placeholder */}
              <div className="relative mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-space-blue/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-space-blue/30">
                  <div className="text-center">
                    <Star className="w-12 h-12 text-space-blue mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      Add image to: <br />
                      <code className="text-space-blue text-xs">{person.imageLocation}</code>
                    </p>
                  </div>
                </div>
                {/* Achievement Badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold">
                  Legend
                </div>
              </div>

              {/* Name and Profession */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-1">{person.name}</h3>
                <p className="text-space-blue font-semibold">{person.profession}</p>
              </div>

              {/* Achievement */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">Achievement</span>
                </div>
                <p className="text-gray-300 text-sm">{person.achievement}</p>
              </div>

              {/* Quote */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Quote className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">Inspirational Quote</span>
                </div>
                <blockquote className="text-gray-300 text-sm italic border-l-2 border-green-400 pl-3">
                  "{person.quote}"
                </blockquote>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-semibold text-sm">Space Experience</span>
                </div>
                <p className="text-gray-300 text-sm">{person.experience}</p>
              </div>

              {/* Unbelievable Story */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Telescope className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 font-semibold text-sm">Extraordinary Moment</span>
                </div>
                <p className="text-gray-300 text-sm">{person.unbelievableStory}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-space-blue/20 to-purple-500/20 rounded-2xl border border-space-blue/30">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Legacy</h2>
          <p className="text-gray-300 text-lg">
            These legends paved the way for humanity's greatest adventure. The next chapter of space exploration starts with you.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SpaceLegendsPage

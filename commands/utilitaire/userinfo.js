const Discord = require('discord.js')
const db = require('quick.db')
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');
const axios = require('axios')
const { MessageEmbed } = require("discord.js")
const moment = require("moment")

module.exports = {
  name: "userinfo",
  category: "info",
  aliases: ["whois", "user", "lookup"],
  usage: "userinfo <MENTION>",
  description: "Affiche les informations relatives à un utilisateur",
  run: async (client, message, args) => {


    let user;

    if (!args[0]) {
      user = message.member;
    } else {


   


      user = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(err => { return message.channel.send(":x: Impossible de trouver cette personne!") })
    }

    if (!user) {
      return message.channel.send(":x: Impossible de trouver cette personne!")
    }


    //OPTIONS FOR STATUS

    let stat = {
      online: "https://emoji.gg/assets/emoji/9166_online.png",
      idle: "https://emoji.gg/assets/emoji/3929_idle.png",
      dnd: "https://emoji.gg/assets/emoji/2531_dnd.png",
      offline: "https://emoji.gg/assets/emoji/7445_status_offline.png"
    }

    //NOW BADGES
    let badges = await user.user.flags
    badges = await badges ? badges.toArray() : ["None"]

    let newbadges = [];
    badges.forEach(m => {
      newbadges.push(m.replace("_", " "))
    })

    let embed = new MessageEmbed()
      .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
    //ACTIVITY
    let array = []
    if (user.user.presence.activities.length) {

      let data = user.user.presence.activities;

      for (let i = 0; i < data.length; i++) {
        let name = data[i].name || "None"
        let xname = data[i].details || "None"
        let zname = data[i].state || "None"
        let type = data[i].type

        array.push(`**${type}** : \`${name} : ${xname} : ${zname}\``)

        if (data[i].name === "Spotify") {
          embed.setThumbnail(`https://i.scdn.co/image/${data[i].assets.largeImage.replace("spotify:", "")}`)
        }

        embed.setDescription(array.join("\n"))

      }
    }

      //EMBED COLOR BASED ON member
      embed.setColor(user.displayHexColor === "#000000" ? "#ffffff" : user.displayHexColor)

      //OTHER STUFF 
      embed.setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))

      //CHECK IF USER HAVE NICKNAME
      if (user.nickname !== null) embed.addField("Pseudonyme", user.nickname)
      embed.addField("**Présent depuis**", moment(user.joinedAt).format("LLLL"))
        .addField("**Compte Créé:** ", moment(user.user.createdAt).format("LLLL"))
        .addField("**Informations Communes**", `ID: \`${user.user.id}\`\nRobot: ${user.user.bot}\nUtilisateur Supprimé: ${user.deleted}`)
        .addField("Badges", newbadges.join(", ").toLowerCase() || "None")
        .setFooter(user.user.presence.status, stat[user.user.presence.status])



      return message.channel.send(embed).catch(err => {
        return message.channel.send("Erreur : " + err)
      })



    }



  }

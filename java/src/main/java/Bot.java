import java.util.ArrayList;
import java.util.Collections;

import javax.security.auth.login.LoginException;

import com.google.common.collect.Lists;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.entities.TextChannel;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.VoiceChannel;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.api.hooks.AnnotatedEventManager;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.dv8tion.jda.api.utils.MemberCachePolicy;

public class Bot {
    
    public static final String TOKEN = null;
    public static final int PER_CHANNEL = 2;
    
    private JDA api;

    public Bot() 
    		throws LoginException, InterruptedException {
    	api = JDABuilder.createDefault(TOKEN)
				.setMemberCachePolicy(MemberCachePolicy.ALL)
				.enableIntents(GatewayIntent.GUILD_MEMBERS)
				.setEventManager(new AnnotatedEventManager())
				.build();
    	
    	api.awaitReady();
    	api.setEventManager(new AnnotatedEventManager());
    	api.addEventListener(this);

    }
    
    @SubscribeEvent
    public void onMemberMessage(GuildMessageReceivedEvent event) {
    	Guild server = event.getGuild();
    	User author = event.getAuthor();
        TextChannel channel = event.getChannel();
        Message message = event.getMessage();
        
    	if(!author.isBot() && event.getMember().getIdLong() == 190984801929396224L) {
    		String[] tokens = message.getContentRaw().toLowerCase().split(" ");
    		if(tokens[0].equals("bb")) {
        		System.out.println("bb");
        		if(tokens[1].equals("shuffle")) {
    	    		System.out.println("shuffle");
    				if(tokens.length > 2) {
    					channel.sendMessage("Starting to shuffle members!").complete();
    					VoiceChannel voice = server.getVoiceChannelById( tokens[2] );
    					ArrayList<Member> members = Lists.newArrayList(voice.getMembers());
    					ArrayList<VoiceChannel> channels = Lists.newArrayList();
    					Collections.shuffle(members);
                        int channelAmount = members.size() / PER_CHANNEL;
    					for(int i = 0; i < channelAmount; i++)
    						channels.add( server.createVoiceChannel("BuddyBot Channel #" + i).complete() );
    					
    					for(int i = 0; i < members.size(); i++) 
    						server.moveVoiceMember(members.get(i), channels.get(i % channelAmount)).complete();
    				
    					channel.sendMessage("Shuffled " + members.size() + " members!").complete();

    				}
    			}	
    			
    		} else 
    			return;
    		
    	} else
    		return;
    	
    }
    
}
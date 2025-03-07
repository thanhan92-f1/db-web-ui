package net.ripe.whois.web.api.whois;

import net.ripe.whois.services.WhoisReferencesService;
import net.ripe.whois.web.api.ApiController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/references")
@SuppressWarnings("UnusedDeclaration")
public class WhoisReferencesController extends ApiController {
    private static final Logger LOGGER = LoggerFactory.getLogger(WhoisReferencesController.class);

    private final WhoisReferencesService whoisReferencesService;

    @Autowired
    public WhoisReferencesController(
        final WhoisReferencesService whoisReferencesService) {
        this.whoisReferencesService = whoisReferencesService;
    }


    @RequestMapping(value = "/{source}/{objectType}/{name:.*}", method = RequestMethod.GET, produces = { MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<String> search(@PathVariable String source, @PathVariable String objectType, @PathVariable String name,
                                         @RequestParam(value = "limit", required = false) Integer limit,
                                         @RequestHeader final HttpHeaders headers) throws URISyntaxException, UnsupportedEncodingException {
        LOGGER.debug("search {} {} {}->{}", source, objectType, name, name);
        removeUnnecessaryHeaders(headers);

        return whoisReferencesService.getReferences(source, objectType, name, limit, headers);
    }

    @RequestMapping(value = "/{source}/{objectType}/{keyPrefix:.*}/{keySuffix:.*}", method = RequestMethod.GET, produces =
            { MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<String> search(@PathVariable String source, @PathVariable String objectType,
                                         @PathVariable String keyPrefix, @PathVariable String keySuffix,
                                         @RequestParam(value = "limit", required = false) Integer limit,
                                         @RequestHeader final HttpHeaders headers) throws URISyntaxException, UnsupportedEncodingException {

        final String key = keyPrefix.concat("/").concat(keySuffix);
        LOGGER.debug("search {} {} {} ->{}", source, objectType, key, key);
        removeUnnecessaryHeaders(headers);

        return whoisReferencesService.getReferences(source, objectType, key, limit, headers);
    }

    @RequestMapping(value = "/{source}", method = RequestMethod.POST)
    public ResponseEntity<String> create(@PathVariable String source,
                                         @RequestBody(required = true) final String body,
                                         @RequestHeader final HttpHeaders headers) throws URISyntaxException {
        LOGGER.debug("create {}", source);
        removeUnnecessaryHeaders(headers);

        return whoisReferencesService.createReferencedObjects(source, body, headers);
    }

    @RequestMapping(value = "/{source}/{objectType}/{name:.*}", method = RequestMethod.DELETE)
    public ResponseEntity<String> delete(@PathVariable String source, @PathVariable String objectType, @PathVariable String name,
                                                 @RequestParam("reason") String reason, @RequestParam(value = "password", required = false) String password,
                                                 @RequestHeader final HttpHeaders headers) throws URISyntaxException, UnsupportedEncodingException {
        LOGGER.debug("delete {} {} {}", source, objectType, name);

        removeUnnecessaryHeaders(headers);

        return whoisReferencesService.deleteObjectAndReferences(source, objectType, name, reason, password, headers);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public void handleIllegalArgumentExceptions() {
        // Nothing to do
    }
}
